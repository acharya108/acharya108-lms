// src/components/admin/DecisionManager.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from '../../styles/Admin.module.css';

const DecisionManager = () => {
  const [newDecision, setNewDecision] = useState({
    title: '',
    description: '',
    decision: '',
    rationale: '',
    category: 'architecture',
    impact: 'medium'
  });

  // Fetch decisions
  const { data: decisions, isLoading, error } = useQuery({
    queryKey: ['decisions'],
    queryFn: async () => {
      const response = await fetch('/api/decisions');
      if (!response.ok) throw new Error('Failed to fetch decisions');
      return response.json();
    }
  });

  const queryClient = useQueryClient();

  // Create decision mutation
  const createMutation = useMutation({
    mutationFn: async (decisionData) => {
      const response = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decisionData)
      });
      if (!response.ok) throw new Error('Failed to create decision');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['decisions']);
      // Reset form
      setNewDecision({
        title: '',
        description: '',
        decision: '',
        rationale: '',
        category: 'architecture',
        impact: 'medium'
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(newDecision);
  };

  const handleInputChange = (field, value) => {
    setNewDecision(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Decisions</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.decisionManager}>
      <div className={styles.header}>
        <h1>Decision Log</h1>
        <p>Track and manage architectural and development decisions</p>
      </div>

      {/* Add New Decision Form */}
      <form onSubmit={handleSubmit} className={styles.decisionForm}>
        <h2>Log New Decision</h2>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Title *</label>
            <input
              type="text"
              value={newDecision.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Brief decision title"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Category</label>
            <select
              value={newDecision.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="architecture">Architecture</option>
              <option value="ui">UI/UX</option>
              <option value="data">Data</option>
              <option value="naming">Naming</option>
              <option value="security">Security</option>
              <option value="performance">Performance</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={newDecision.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Context and background for this decision"
            rows="2"
          />
        </div>

        <div className={styles.formGroup}>
          <label>The Decision *</label>
          <textarea
            value={newDecision.decision}
            onChange={(e) => handleInputChange('decision', e.target.value)}
            placeholder="What was decided? Be specific and actionable."
            rows="3"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Rationale *</label>
          <textarea
            value={newDecision.rationale}
            onChange={(e) => handleInputChange('rationale', e.target.value)}
            placeholder="Why was this decision made? What alternatives were considered?"
            rows="3"
            required
          />
        </div>

        <div className={styles.formFooter}>
          <div className={styles.formGroup}>
            <label>Impact Level</label>
            <select
              value={newDecision.impact}
              onChange={(e) => handleInputChange('impact', e.target.value)}
            >
              <option value="low">Low Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="high">High Impact</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={createMutation.isLoading}
            className={styles.submitButton}
          >
            {createMutation.isLoading ? 'Logging...' : 'Log Decision'}
          </button>
        </div>
      </form>

      {/* Decisions List */}
      <div className={styles.decisionsList}>
        <h2>Recent Decisions ({decisions?.length || 0})</h2>
        
        {isLoading ? (
          <div className={styles.loading}>Loading decisions...</div>
        ) : decisions?.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No decisions logged yet. Create your first decision above!</p>
          </div>
        ) : (
          <div className={styles.decisionsGrid}>
            {decisions?.map((decision) => (
              <div key={decision.id} className={styles.decisionCard}>
                <div className={styles.decisionHeader}>
                  <h3>{decision.title}</h3>
                  <span className={`${styles.impactBadge} ${styles[decision.impact]}`}>
                    {decision.impact} impact
                  </span>
                </div>
                
                <div className={styles.decisionMeta}>
                  <span className={styles.category}>{decision.category}</span>
                  <span className={styles.date}>
                    {new Date(decision.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {decision.description && (
                  <p className={styles.description}>{decision.description}</p>
                )}
                
                <div className={styles.decisionContent}>
                  <strong>Decision:</strong> {decision.decision}
                </div>
                
                <div className={styles.rationale}>
                  <strong>Rationale:</strong> {decision.rationale}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionManager;