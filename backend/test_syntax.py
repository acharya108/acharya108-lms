# test_syntax.py
import os
import sys

def test_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        compile(content, filename, 'exec')
        print(f"✅ {filename} - No syntax errors")
        return True
    except SyntaxError as e:
        print(f"❌ {filename} - Syntax error: {e}")
        return False
    except Exception as e:
        print(f"❌ {filename} - Error reading: {e}")
        return False

# Test both files
files_ok = True
files_ok &= test_file('main.py')
files_ok &= test_file('registration.py')

if files_ok:
    print("\n🎉 All files are syntactically correct!")
else:
    print("\n⚠️  Some files have issues")