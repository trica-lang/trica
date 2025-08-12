import React, { useState } from 'react';
import { Save, FileText, Code, Folder, Edit3, Star } from 'lucide-react';
import { useInkflow, useInkflowContent } from '../contexts/InkflowContext';

const InkflowContent = ({ code, title, onSave }) => {
  const { user, isAuthenticated, error } = useInkflow();
  const { saveToInkflow, canSave } = useInkflowContent();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [contentTitle, setContentTitle] = useState(title || 'TRICA Code Snippet');

  const handleSaveToInkflow = async () => {
    if (!canSave) {
      alert('Please sign in with INKFLOW first!');
      return;
    }

    if (!code || !code.trim()) {
      alert('No code to save!');
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus('saving');

      const result = await saveToInkflow(contentTitle, code, {
        version: '2.0.0',
        performance: 'sub-400ns', // Your legendary performance!
        language: 'trica',
        created_with: 'TRICA Web IDE'
      });

      setSaveStatus('success');
      if (onSave) onSave(result);
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Failed to save to INKFLOW:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProject = async (projectData) => {
    if (!canSave) {
      alert('Please sign in with INKFLOW first!');
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus('saving');

      const result = await saveToInkflow(
        `${projectData.name} (Project)`,
        JSON.stringify(projectData, null, 2),
        {
          type: 'trica-project',
          project_name: projectData.name,
          files: projectData.files,
          dependencies: projectData.dependencies,
          ...projectData.metadata
        }
      );

      setSaveStatus('success');
      if (onSave) onSave(result);
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Failed to save project to INKFLOW:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="inkflow-content-disabled">
        <div className="inkflow-prompt">
          <Edit3 size={24} />
          <h3>Save to INKFLOW</h3>
          <p>Sign in with INKFLOW to save your TRICA code and projects to your content platform!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inkflow-content-manager">
      <div className="inkflow-header">
        <div className="inkflow-user">
          <Edit3 size={20} />
          <span>Connected to INKFLOW</span>
          <Star size={16} className="verified-icon" />
        </div>
      </div>

      <div className="save-options">
        <div className="save-section">
          <h4><Code size={16} /> Save Current Code</h4>
          <div className="title-input">
            <input
              type="text"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              placeholder="Enter title for your code..."
              className="content-title-input"
            />
          </div>
          <button
            onClick={handleSaveToInkflow}
            disabled={isSaving || !code}
            className={`save-btn ${saveStatus}`}
          >
            {isSaving ? (
              <div className="spinner"></div>
            ) : saveStatus === 'success' ? (
              <Star size={16} />
            ) : (
              <Save size={16} />
            )}
            <span>
              {saveStatus === 'saving' ? 'Saving to INKFLOW...' :
               saveStatus === 'success' ? 'Saved Successfully!' :
               saveStatus === 'error' ? 'Save Failed' :
               'Save to INKFLOW'}
            </span>
          </button>
        </div>

        <div className="save-section">
          <h4><Folder size={16} /> Save as Project</h4>
          <p>Save your entire TRICA workspace as a project</p>
          <button
            onClick={() => handleSaveProject({
              name: contentTitle,
              files: [{ name: 'main.trica', content: code }],
              dependencies: [],
              metadata: { created_with: 'TRICA Web IDE' }
            })}
            disabled={isSaving || !code}
            className={`save-btn project-btn ${saveStatus}`}
          >
            {isSaving ? (
              <div className="spinner"></div>
            ) : (
              <Folder size={16} />
            )}
            <span>Save as Project</span>
          </button>
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="success-message">
          <FileText size={16} />
          <span>Content saved to your INKFLOW account! 🎉</span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="error-message">
          <span>Failed to save to INKFLOW. Please try again.</span>
        </div>
      )}

      <style jsx>{`
        .inkflow-content-manager {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          color: white;
        }

        .inkflow-content-disabled {
          background: rgba(102, 126, 234, 0.1);
          border: 2px dashed #667eea;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 20px 0;
        }

        .inkflow-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #667eea;
        }

        .inkflow-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .inkflow-user {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .verified-icon {
          color: #ffd700;
        }

        .save-options {
          display: grid;
          gap: 20px;
        }

        .save-section h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          font-size: 16px;
        }

        .title-input {
          margin-bottom: 15px;
        }

        .content-title-input {
          width: 100%;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 14px;
        }

        .content-title-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .save-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .save-btn.success {
          background: rgba(34, 197, 94, 0.3);
          border-color: #22c55e;
        }

        .save-btn.error {
          background: rgba(239, 68, 68, 0.3);
          border-color: #ef4444;
        }

        .success-message, .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-radius: 8px;
          margin-top: 15px;
          font-weight: 500;
        }

        .success-message {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid #22c55e;
          color: #22c55e;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid #ef4444;
          color: #ef4444;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InkflowContent;