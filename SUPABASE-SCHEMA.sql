-- 🚀 TRICA REVIEWS DATABASE SCHEMA
-- Run this in your Supabase SQL Editor

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  mind_destroyed BOOLEAN DEFAULT true,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table for tracking user interactions
CREATE TABLE IF NOT EXISTS review_likes (
  id BIGSERIAL PRIMARY KEY,
  review_id BIGINT REFERENCES reviews(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,
  is_like BOOLEAN NOT NULL, -- true for like, false for dislike
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_ip)
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert reviews" ON reviews;
CREATE POLICY "Anyone can insert reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Create policies for review_likes
DROP POLICY IF EXISTS "Review likes are viewable by everyone" ON review_likes;
CREATE POLICY "Review likes are viewable by everyone" ON review_likes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert review likes" ON review_likes;
CREATE POLICY "Anyone can insert review likes" ON review_likes
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own likes" ON review_likes;
CREATE POLICY "Users can update their own likes" ON review_likes
  FOR UPDATE USING (true);

-- Create function to update review like counts
CREATE OR REPLACE FUNCTION update_review_likes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_like THEN
      UPDATE reviews SET likes = likes + 1 WHERE id = NEW.review_id;
    ELSE
      UPDATE reviews SET dislikes = dislikes + 1 WHERE id = NEW.review_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle like/dislike toggle
    IF OLD.is_like != NEW.is_like THEN
      IF NEW.is_like THEN
        UPDATE reviews SET likes = likes + 1, dislikes = dislikes - 1 WHERE id = NEW.review_id;
      ELSE
        UPDATE reviews SET likes = likes - 1, dislikes = dislikes + 1 WHERE id = NEW.review_id;
      END IF;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.is_like THEN
      UPDATE reviews SET likes = likes - 1 WHERE id = OLD.review_id;
    ELSE
      UPDATE reviews SET dislikes = dislikes - 1 WHERE id = OLD.review_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS review_likes_trigger ON review_likes;

-- Create trigger
CREATE TRIGGER review_likes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON review_likes
  FOR EACH ROW EXECUTE FUNCTION update_review_likes();

-- Insert initial mind-destroying reviews
INSERT INTO reviews (name, rating, title, comment, verified, likes, dislikes, created_at) VALUES
('Dr. Alan Turing', 5, 'My Mind Has Been Physically Destroyed', 'I thought I understood computation until I encountered Trica. The deceptively simple syntax hiding infinite algorithmic complexity has literally broken my understanding of programming languages. 10/10 would have mind destroyed again.', true, 42, 0, NOW() - INTERVAL '5 days'),
('Linus Torvalds', 5, 'Even I''m Confused (And That''s Saying Something)', 'I''ve written operating systems, but Trica''s <1μs execution time while maintaining infinite complexity is beyond my comprehension. This language defies the laws of computer science. Absolutely mind-bending!', true, 38, 1, NOW() - INTERVAL '4 days'),
('Grace Hopper', 5, 'Debugging This Would Take Forever', 'I invented the first compiler, but Trica''s compiler is something else entirely. It generates C code so optimized that it runs faster than the speed of light. My debugging skills are useless here.', true, 35, 0, NOW() - INTERVAL '3 days'),
('Anonymous Programmer', 4, 'Lost My Job Because of Trica', 'I showed Trica to my boss and now he expects all our code to execute in <1μs. I can''t explain that Trica is the only language capable of this. Send help.', false, 28, 3, NOW() - INTERVAL '2 days'),
('Quantum Computing Researcher', 5, 'Makes Quantum Computing Look Simple', 'I work with quantum computers daily, but Trica''s quantum loops and superposition variables make quantum mechanics look like basic arithmetic. This is next-level programming.', false, 31, 2, NOW() - INTERVAL '1 day'),
('CS Professor', 3, 'Had to Rewrite My Entire Curriculum', 'After discovering Trica, I realized everything I''ve been teaching about computational complexity is wrong. The students are confused, I''m confused, everyone''s confused. But somehow the code still works perfectly.', false, 22, 8, NOW() - INTERVAL '12 hours'),
('Elon Musk', 5, 'Using This for Mars Mission Code', 'We''re replacing all SpaceX flight software with Trica. The <1μs execution time means we can calculate rocket trajectories faster than physics allows. Mars, here we come! 🚀', true, 156, 5, NOW() - INTERVAL '6 hours'),
('GitHub Copilot', 2, 'I Cannot Understand This Language', 'As an AI trained on millions of code repositories, I must admit defeat. Trica''s infinite complexity hidden behind simple syntax has broken my neural networks. Error 404: Logic not found.', true, 89, 23, NOW() - INTERVAL '3 hours'),
('Stack Overflow Moderator', 4, 'Closed 1000+ Trica Questions as "Too Broad"', 'Every Trica question on Stack Overflow gets closed because the answers would require explaining the entire universe. The complexity is literally infinite. We''ve given up moderating Trica posts.', false, 67, 12, NOW() - INTERVAL '1 hour'),
('Junior Developer', 5, 'Finally, A Language I Can''t Google', 'I''ve been programming for 6 months and could Google solutions to everything. But Trica? There are no Stack Overflow answers because no human can comprehend it. I''m finally learning! 🧠💥', false, 45, 2, NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_review_likes_review_id ON review_likes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_likes_user_ip ON review_likes(user_ip);

-- Create a view for reviews with aggregated stats
CREATE OR REPLACE VIEW reviews_with_stats AS
SELECT 
  r.*,
  COALESCE(r.likes, 0) as total_likes,
  COALESCE(r.dislikes, 0) as total_dislikes,
  (COALESCE(r.likes, 0) - COALESCE(r.dislikes, 0)) as score
FROM reviews r
ORDER BY r.created_at DESC;

-- Grant permissions
GRANT ALL ON reviews TO anon;
GRANT ALL ON review_likes TO anon;
GRANT ALL ON reviews_with_stats TO anon;
GRANT USAGE ON SEQUENCE reviews_id_seq TO anon;
GRANT USAGE ON SEQUENCE review_likes_id_seq TO anon;