# ============================================================================
# FILE: backend/api/routes/cms.py
# Complete CMS API Endpoints for Teachers/Admins
# ============================================================================

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
from typing import List, Optional, Dict, Any
from prisma import Prisma
from datetime import datetime
import os
import json

# Import services
from api.services.pdf_processor import PDFProcessor
from api.services.ai_service import AIService
from api.services.content_enricher import ContentEnricher
from api.middleware.auth import get_current_user, require_role

router = APIRouter()
db = Prisma()

# Initialize services
pdf_processor = PDFProcessor()
ai_service = AIService()
content_enricher = ContentEnricher()

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class LessonCreate(BaseModel):
    title: str
    courseId: str
    subjectId: str
    description: Optional[str] = None
    order: int = 0

class LessonContentUpdate(BaseModel):
    level: int
    richTextNotes: str
    videoUrls: List[str] = []
    interactives: Dict[str, Any] = {}
    definitions: Dict[str, Any] = {}
    
    @validator('level')
    def validate_level(cls, v):
        if v not in [1, 2, 3, 4, 5]:
            raise ValueError('Level must be between 1 and 5')
        return v

class QuestionCreate(BaseModel):
    lessonId: str
    type: str  # "MCQ" or "Descriptive"
    questionText: str
    difficulty: int
    options: Optional[List[str]] = None
    correctAnswer: Optional[str] = None
    keyTerms: List[str] = []
    position: str = "within_lesson"
    
    @validator('type')
    def validate_type(cls, v):
        if v not in ['MCQ', 'Descriptive']:
            raise ValueError('Type must be MCQ or Descriptive')
        return v
    
    @validator('difficulty')
    def validate_difficulty(cls, v):
        if v not in [1, 2, 3, 4, 5]:
            raise ValueError('Difficulty must be between 1 and 5')
        return v

class DescriptiveAnswerCreate(BaseModel):
    questionId: str
    level: int
    answerText: str
    expectedTerms: List[str] = []
    rubric: Dict[str, Any] = {}

class ContentVersionCreate(BaseModel):
    entityType: str  # "lesson", "question", "content"
    entityId: str
    changes: Dict[str, Any]
    reason: str

# ============================================================================
# DASHBOARD & ANALYTICS
# ============================================================================

@router.get("/dashboard")
async def get_cms_dashboard(current_user = Depends(require_role(['teacher', 'admin']))):
    """Get CMS dashboard statistics"""
    try:
        # Get total counts
        total_lessons = await db.lesson.count()
        total_students = await db.user.count(where={'role': 'student'})
        total_questions = await db.question.count()
        
        # Get average progress
        progress_data = await db.user_progress.aggregate({
            '_avg': {'score': True}
        })
        avg_progress = progress_data._avg.score or 0
        
        # Get recent activity
        recent_lessons = await db.lesson.find_many(
            take=5,
            order_by={'createdAt': 'desc'},
            include={'subject': True, 'course': True}
        )
        
        recent_students = await db.enrollment.find_many(
            take=5,
            order_by={'enrolledAt': 'desc'},
            include={'user': True, 'course': True}
        )
        
        return {
            'stats': {
                'totalLessons': total_lessons,
                'totalStudents': total_students,
                'totalQuestions': total_questions,
                'avgProgress': round(avg_progress, 1)
            },
            'recentActivity': [
                {
                    'id': f'lesson-{lesson.id}',
                    'type': 'lesson',
                    'title': f'Created: {lesson.title}',
                    'time': lesson.createdAt.isoformat()
                }
                for lesson in recent_lessons
            ] + [
                {
                    'id': f'enrollment-{enrollment.id}',
                    'type': 'student',
                    'title': f'New enrollment: {enrollment.user.name}',
                    'time': enrollment.enrolledAt.isoformat()
                }
                for enrollment in recent_students
            ]
        }
    except Exception as e:
        print(f"❌ Dashboard error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# PDF PROCESSING
# ============================================================================

@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user = Depends(require_role(['teacher', 'admin']))
):
    """Upload and process PDF file"""
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files allowed")
        
        # Save uploaded file temporarily
        temp_path = f"/tmp/{file.filename}"
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        print(f"📄 Processing PDF: {file.filename}")
        
        # Extract text from PDF
        extracted_text = await pdf_processor.extract_text(temp_path)
        
        # Extract metadata
        metadata = await pdf_processor.extract_metadata(temp_path)
        
        # Clean up temporary file
        os.remove(temp_path)
        
        print(f"✅ PDF processed: {len(extracted_text)} characters extracted")
        
        return {
            'success': True,
            'filename': file.filename,
            'extractedText': extracted_text,
            'metadata': metadata,
            'characterCount': len(extracted_text),
            'wordCount': len(extracted_text.split())
        }
        
    except Exception as e:
        print(f"❌ PDF upload error: {e}")
        raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(e)}")

# ============================================================================
# AI NOTE GENERATION
# ============================================================================

@router.post("/generate-notes")
async def generate_notes(
    data: Dict[str, Any],
    current_user = Depends(require_role(['teacher', 'admin']))
):
    """Generate notes at all 5 levels from extracted text"""
    try:
        extracted_text = data.get('text', '')
        lesson_id = data.get('lessonId')
        subject = data.get('subject', '')
        
        if not extracted_text:
            raise HTTPException(status_code=400, detail="No text provided")
        
        print(f"🤖 Generating notes for all 5 levels...")
        
        # Generate notes for each level
        level_notes = {}
        
        for level in range(1, 6):
            print(f"  Generating Level {level}...")
            notes = await ai_service.generate_level_notes(
                text=extracted_text,
                level=level,
                subject=subject
            )
            
            # Enrich with multimedia content
            enriched_content = await content_enricher.enrich_content(
                notes=notes,
                level=level,
                subject=subject
            )
            
            level_notes[level] = {
                'notes': notes,
                'videos': enriched_content.get('videos', []),
                'interactives': enriched_content.get('interactives', {}),
                'definitions': enriched_content.get('definitions', {})
            }
        
        # Save to database if lessonId provided
        if lesson_id:
            for level, content in level_notes.items():
                await db.lesson_content.upsert(
                    where={
                        'lessonId_level': {
                            'lessonId': lesson_id,
                            'level': level
                        }
                    },
                    data={
                        'create': {
                            'lessonId': lesson_id,
                            'level': level,
                            'richTextNotes': content['notes'],
                            'videoUrls': json.dumps(content['videos']),
                            'interactives': json.dumps(content['interactives']),
                            'definitions': json.dumps(content['definitions'])
                        },
                        'update': {
                            'richTextNotes': content['notes'],
                            'videoUrls': json.dumps(content['videos']),
                            'interactives': json.dumps(content['interactives']),
                            'definitions': json.dumps(content['definitions'])
                        }
                    }
                )
        
        print(f"✅ Notes generated for all 5 levels")
        
        return {
            'success': True,
            'levels': level_notes,
            'message': 'Notes generated successfully for all levels'
        }
        
    except Exception as e:
        print(f"❌ Note generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Note generation failed: {str(e)}")

# ============================================================================
# LESSON CRUD OPERATIONS
# ============================================================================

@router.get("/lessons")
async def get_lessons(
    board: Optional[str] = None,
    grade: Optional[str] = None,
    subject: Optional[str] = None,
    search: Optional[str] = None,
    current_user = Depends(require_role(['teacher', 'admin']))
):
    """Get all lessons with optional filters"""
    try:
        where_clause = {}
        
        if search:
            where_clause['OR'] = [
                {'title': {'contains': search, 'mode': 'insensitive'}},
                {'description': {'contains': search, 'mode': 'insensitive'}}
            ]
        
        lessons = await db.lesson.find_many(
            where=where_clause,
            include={
                'subject': {
                    'include': {
                        'grade': {
                            'include': {'board': True}
                        }
                    }
                },
                'course': True,
                'contents': True,
                'questions': True
            },
            order_by={'createdAt': 'desc'}
        )
        
        # Format response
        formatted_lessons = []
        for lesson in lessons:
            formatted_lessons.append({
                'id': lesson.id,
                'title': lesson.title,
                'description': lesson.description,
                'board': lesson.subject.grade.board.name if lesson.subject else 'N/A',
                'grade': lesson.subject.grade.name if lesson.subject else 'N/A',
                'subject': lesson.subject.name if lesson.subject else 'N/A',
                'status': 'Published' if len(lesson.contents) > 0 else 'Draft',
                'contentLevels': len(lesson.contents),
                'questionCount': len(lesson.questions),
                'createdAt': lesson.createdAt.isoformat()
            })
        
        return formatted_lessons
        
    except Exception as e:
        print(f"❌ Get lessons error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/lessons/{lesson_id}")
async def get_lesson(
    lesson_id: str,
    current_user = Depends(require_role(['teacher', 'admin']))
):
    """Get detailed lesson information"""
    try:
        lesson = await db.lesson.find_unique(
            where={'id': lesson_id},
            include={
                'subject': {
                    'include': {
                        'grade': {
                            'include': {'board': True}
                        }
                    }
                },
                'course': True,
                'contents': True,
                'questions': {
                    'include': {'answers': True}
                }
            }
        )
        
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        
        # Format content by level
        level_content = {}
        for content in lesson.contents:
            level_content[content.level] = {
                'notes': content.richTextNotes,
                'videos': json.loads(content.videoUrls) if content.videoUrls else [],
                'interactives': json.loads(content.interactives) if content.interactives else {},
                'definitions': json.loads(content.definitions) if content.definitions else {}
            }
        
        return {
            'id': lesson.id,
            'title': lesson.title,
            'description': lesson.description,
            'board': lesson.subject.grade.board.name if lesson.subject else None,
            'grade': lesson.subject.grade.name if lesson.subject else None,
            'subject': lesson.subject.name if lesson.subject else None,
            'courseId': lesson.courseId,
            'subjectId': lesson.subjectId,
            'order': lesson.order,
            'levels': level_content,
            'questions': [
                {
                    'id': q.id,
                    'type': q.type,
                    'questionText': q.questionText,
                    'difficulty': q.difficulty,
                    'options': json.loads(q.options) if q.options else None,
                    'correctAnswer': q.correctAnswer,
                    'keyTerms': json.loads(q.keyTerms) if q.keyTerms else [],
                    'answerCount': len(q.answers)
                }
                for q in lesson.questions
            ],
            'createdAt': lesson.createdAt.isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Get lesson error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/lessons")
async def create_lesson(
    lesson_data: LessonCreate,
    current_user = Depends(require_role(['teacher', 'admin']))
):
    """Create new lesson"""
    try:
        # Generate unique lessonId
        lesson_count = await db.lesson.count(where={'courseId': lesson_data.courseId})
        lesson_id = f"L{lesson_count + 1:03d}"
        
        new_lesson = await db.lesson.create(
            data={
                'title': lesson_data.title,
                'courseId': lesson_data.courseId,
                'subjectId': lesson_data.subjectId,
                'lessonId': lesson_id,
                'description': lesson_data.description,
                'order': lesson_data.order
            }
        )
        
        print(f"✅ Lesson created: {new_lesson.title} ({new_lesson.id})")
        
        return {
            'success': True,
            'lesson': {
                'id': new_lesson.id,
                'title': new_lesson.title,
                'lessonId': new_lesson.lessonId
            }
        }
        
    except Exception as e:
        print(f"❌ Create lesson error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/lessons/{lesson_id}")
async def update_lesson(
    lesson_id: str,
    lesson_data: LessonCreate,
    current_user = Depends(require_role(['teacher', 'admin']))
):
    """Update existing lesson"""
    try:
        updated_lesson = await db.lesson.update(
            where={'id': lesson_id},
            data={
                'title': lesson_data.title,
                'description': lesson_data.description,
                'order': lesson_data.order
            }
        )
        
        print(f"✅ Lesson updated: {updated_lesson.title}")
        
        return {
            'success': True,
            'lesson': {
                'id': updated_lesson.id,
                'title': updated_lesson.title
            }
        }
        
    except Exception as e:
        print(f"❌ Update lesson error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/lessons/{lesson_id}")
async def delete_lesson(
    lesson_id: str,
    current_user = Depends(require_role(['teacher', 'admin']))
):
    """Delete lesson and all related content"""
    try:
        # Delete related content (cascade should handle this)
        await db.lesson.delete(where={'id': lesson_id})
        
        print(f"✅ Lesson deleted: {lesson_id}")
        
        return {
            'success': True,
            'message': 'Lesson deleted successfully'
        }
        
    except Exception as e:
        print(f"❌ Delete lesson error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# LESSON CONTENT OPERATIONS
# ============================================================================

@router.put("/lessons/{lesson_id}/content")
async def update_lesson_content(
    lesson_id: str,
    content_data: LessonContentUpdate,
    current_user = Depends(require_role(['teacher', 'admin']))
):
    """Update content for specific level"""
    try:
        updated_content = await db.lesson_content.upsert(
            where={
                'lessonId_level': {
                    'lessonId': lesson_id,
                    'level': content_data.level
                }
            },
            data={
                'create': {
                    'lessonId': lesson_id,
                    'level': content_data.level,
                    'richTextNotes': content_data.richTextNotes,
                    'videoUrls': json.dumps(content_data.videoUrls),
                    'interactives': json.dumps(content_data.interactives),
                    'definitions': json.dumps(content_data.definitions)
                },
                'update': {
                    'richTextNotes': content_data.richTextNotes,
                    'videoUrls': json.dumps(content_data.videoUrls),
                    'interactives': json.dumps(content_data.interactives),
                    'definitions': json.dumps(content_data.definitions)
                }
            }
        )
        
        print(f"✅ Content updated: Lesson {lesson_id}, Level {content_data.level}")
        
        return {
            'success': True,
            'content': {
                'id': updated_content.id,
                'lessonId': updated_content.lessonId,
                'level': updated_content.level
            }
        }
        
    except Exception as e:
        print(f"❌ Update content error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
