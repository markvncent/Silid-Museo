import { useState, useEffect } from 'react';
import MediaPlayer from './MediaPlayer.jsx';
import { submitRating, getAverageRating } from '../../services/ratings.js';
import { submitArtworkFeedback, getArtworkFeedback } from '../../services/feedback.js';

export default function ArtworkModal({ artwork, onClose, onUpdateArtwork }) {
  const { id, title, description, media_url, media_type, thumbnail_url, is_fallback } = artwork;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedScore, setVotedScore] = useState(0);
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Load local votes and comments from localStorage (especially for fallback items)
useEffect(() => {
    // 1. Check if voted
    const localVotes = JSON.parse(localStorage.getItem('gallery_votes') || '{}');
    if (localVotes[id]) {
      setHasVoted(true);
      setVotedScore(localVotes[id]);
      setRating(localVotes[id]);
    }
    // 2. Load comments
    loadComments();

    // 3. Load rating summary
    loadRatingSummary();
  }, [id]);

  const loadComments = async () => {
    try {
      // Always merge Supabase comments + local mock comments
      let dbComments = [];
      if (!is_fallback) {
        try {
          dbComments = await getArtworkFeedback(id);
        } catch (_e) {
          console.warn('Could not load comments from Supabase, using local fallback only');
        }
      }
      
      const localComments = JSON.parse(localStorage.getItem(`gallery_comments_${id}`) || '[]');
      const combined = [...localComments, ...dbComments].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setComments(combined);
    } catch (err) {
      console.error(err);
    }
  };
  const loadRatingSummary = async () => {
    if (is_fallback) return;
    try {
      const summary = await getAverageRating(id);
      if (onUpdateArtwork) {
        onUpdateArtwork(id, { artwork_ratings_summary: summary });
      }
    } catch (err) {
      console.warn('Could not load rating summary:', err.message);
    }
  };

  const handleRatingSubmit = async (score) => {
    if (hasVoted || isSubmittingRating) return;
    setIsSubmittingRating(true);

    try {
      if (!is_fallback) {
        try {
          // Generate or load voter token
          let voterToken = localStorage.getItem('voter_token');
          if (!voterToken) {
            voterToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
            localStorage.setItem('voter_token', voterToken);
          }
          await submitRating(id, score, voterToken);
        } catch (_e) {
          console.warn('Database submit failed, storing rating locally instead');
        }
      }

      // Save locally
      const localVotes = JSON.parse(localStorage.getItem('gallery_votes') || '{}');
      localVotes[id] = score;
      localStorage.setItem('gallery_votes', JSON.stringify(localVotes));

      setHasVoted(true);
      setVotedScore(score);
      setRating(score);

      // Trigger update of ratings summary on parent component
      if (onUpdateArtwork) {
        // Fetch new averages if DB-backed
        if (!is_fallback) {
          try {
            const summary = await getAverageRating(id);
            onUpdateArtwork(id, { artwork_ratings_summary: summary });
          } catch (_e) {
            updateLocalAverage(score);
          }
        } else {
          updateLocalAverage(score);
        }
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const updateLocalAverage = (newScore) => {
    const currentSummary = artwork.artwork_ratings_summary || { average_rating: 0, rating_count: 0 };
    const newCount = (currentSummary.rating_count || 0) + 1;
    const newAvg = parseFloat(
      (((currentSummary.average_rating || 0) * (currentSummary.rating_count || 0) + newScore) / newCount).toFixed(1)
    );
    onUpdateArtwork(id, {
      artwork_ratings_summary: {
        average_rating: newAvg,
        rating_count: newCount
      }
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;
    setIsSubmittingComment(true);

    const commentObject = {
      id: `local-comment-${Date.now()}`,
      artwork_id: id,
      comment_text: newComment.trim(),
      created_at: new Date().toISOString()
    };

    try {
      if (!is_fallback) {
        try {
          await submitArtworkFeedback(id, newComment.trim());
          // Reload from db to get official record
          loadComments();
          setNewComment('');
          return;
        } catch (_err) {
          console.warn('Database submit failed, storing comment locally instead');
        }
      }

      // Save locally as fallback/preview comment
      const localComments = JSON.parse(localStorage.getItem(`gallery_comments_${id}`) || '[]');
      localComments.unshift(commentObject);
      localStorage.setItem(`gallery_comments_${id}`, JSON.stringify(localComments));
      
      setComments((prev) => [commentObject, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 md:p-6 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div 
        className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border bg-neutral-950 shadow-2xl md:flex-row"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {/* Close Button */}
        <button
        type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-neutral-400 hover:text-white hover:bg-black/95 transition-all duration-300 border border-white/5"
        >
          <span className="text-xl">✕</span>
        </button>

        {/* Left Side: Media Display */}
        <div className="flex flex-1 items-center justify-center bg-neutral-900/40 p-6 md:p-8 border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--border-subtle)' }}>
          <MediaPlayer mediaUrl={media_url} mediaType={media_type} title={title} thumbnailUrl={thumbnail_url} />
        </div>

        {/* Right Side: Info & Interactions */}
        <div className="flex w-full flex-col md:w-[400px] h-full overflow-y-auto p-6 md:p-8 bg-neutral-950">
          {/* Header */}
          <div className="mb-6 mt-4">
            <h2 className="text-2xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-muted)' }}>
              {description}
            </p>
          </div>

          {/* Rating Section */}
          <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              {hasVoted ? 'Your Rating' : 'Rate this Piece'}
            </h3>
            
            <div className="flex items-center gap-2">
              {/* Star Rating Selector */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                  type ="button"
                    key={star}
                    disabled={hasVoted}
                    onMouseEnter={() => !hasVoted && setHoverRating(star)}
                    onMouseLeave={() => !hasVoted && setHoverRating(0)}
                    onClick={() => handleRatingSubmit(star)}
                    className={`text-2xl transition-all duration-200 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-500 scale-110'
                        : 'text-neutral-700 hover:text-neutral-500'
                    } ${hasVoted ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              
              {hasVoted && (
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  Voted {votedScore}/5
                </span>
              )}
            </div>
            
            {/* Average Rating details */}
            <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Average:</span>
              <span className="font-semibold text-white">
                {artwork.artwork_ratings_summary?.average_rating || 0} / 5
              </span>
              <span>•</span>
              <span>
                {artwork.artwork_ratings_summary?.rating_count || 0} rating(s)
              </span>
            </div>
          </div>

          {/* Feedback/Comments Section */}
          <div className="flex-1 flex flex-col min-h-[250px]">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              Feedback & Discussion
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <div className="flex flex-col gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this piece..."
                  rows="2"
                  className="w-full rounded-xl border p-3 text-xs outline-none transition-all duration-300 resize-none bg-neutral-900/60"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment || !newComment.trim()}
                  className="self-end rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                  }}
                >
                  {isSubmittingComment ? 'Sending...' : 'Post Comment'}
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[200px]">
              {comments.length === 0 ? (
                <p className="text-xs text-center italic py-6" style={{ color: 'var(--text-muted)' }}>
                  No comments yet. Be the first to share!
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-lg border text-[11px] leading-relaxed"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <p style={{ color: 'var(--text-primary)' }}>{comment.comment_text}</p>
                    <span className="block mt-1 text-[9px] text-right" style={{ color: 'var(--text-muted)' }}>
                      {new Date(comment.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
