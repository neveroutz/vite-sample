import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useGoogleSheetsBoard from './hooks/useGoogleSheetsBoard';

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, loading, error, getPostById, getAdjacentPosts } = useGoogleSheetsBoard();

  // 현재 게시글 조회
  const post = getPostById(id);
  const { prevPost, nextPost } = getAdjacentPosts(id);

  // 게시글이 없을 때 404 처리
  useEffect(() => {
    if (!loading && posts.length > 0 && !post) {
      navigate('/board', { replace: true });
    }
  }, [post, loading, posts.length, navigate]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 내용을 줄바꿈 기준으로 파라그래프로 분할
  const formatContent = (content) => {
    if (!content) return '';
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() ? (
        <p key={index} style={{ marginBottom: '16px', lineHeight: '1.6' }}>
          {paragraph.trim()}
        </p>
      ) : (
        <br key={index} />
      )
    ));
  };

  if (loading) {
    return (
      <div className="page wide">
        <div className="content">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
            <p>게시글을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page wide">
        <div className="content">
          <div className="error-message">
            ❌ 게시글 로딩 실패: {error}
            <div style={{ marginTop: '20px' }}>
              <Link to="/board" style={{ color: '#007bff', textDecoration: 'none' }}>
                ← 게시판으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page wide">
        <div className="content">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
            <h2>게시글을 찾을 수 없습니다</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              요청하신 게시글이 존재하지 않거나 삭제되었습니다.
            </p>
            <Link
              to="/board"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              게시판으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page wide">
      <div className="content">
        {/* 상단 네비게이션 */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            to="/BoardList"
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ← 게시판 목록
          </Link>
        </div>

        {/* 게시글 헤더 */}
        <div style={{
          borderBottom: '2px solid #007bff',
          paddingBottom: '20px',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '15px',
            lineHeight: '1.4'
          }}>
            {post.title}
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            color: '#666',
            fontSize: '14px'
          }}>
            <span>
              <strong>작성자:</strong> {post.author}
            </span>
            <span>
              <strong>등록일:</strong> {formatDate(post.createdAt)}
            </span>
            <span>
              <strong>조회수:</strong> {post.views.toLocaleString()}
            </span>
            <span>
              <strong>게시글 번호:</strong> {post.id}
            </span>
          </div>
        </div>

        {/* 게시글 내용 */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '30px',
          borderRadius: '8px',
          marginBottom: '40px',
          minHeight: '400px'
        }}>
          <div style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#333'
          }}>
            {formatContent(post.content)}
          </div>
        </div>

        {/* 이전/다음 게시글 네비게이션 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 0',
          borderTop: '1px solid #dee2e6',
          borderBottom: '1px solid #dee2e6',
          marginBottom: '30px'
        }}>
          <div style={{ flex: 1 }}>
            {prevPost ? (
              <Link
                to={`/board/${prevPost.id}`}
                style={{
                  color: '#007bff',
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                <div style={{ fontSize: '12px', color: '#666' }}>이전 글</div>
                <div style={{ marginTop: '4px' }}>
                  ← {prevPost.title.length > 30 ? prevPost.title.substring(0, 30) + '...' : prevPost.title}
                </div>
              </Link>
            ) : (
              <div style={{ color: '#ccc' }}>
                <div style={{ fontSize: '12px' }}>이전 글</div>
                <div style={{ marginTop: '4px' }}>이전 글이 없습니다</div>
              </div>
            )}
          </div>

          <div style={{
            flex: '0 0 auto',
            padding: '0 20px',
            textAlign: 'center'
          }}>
            <Link
              to="/board"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              목록
            </Link>
          </div>

          <div style={{ flex: 1, textAlign: 'right' }}>
            {nextPost ? (
              <Link
                to={`/board/${nextPost.id}`}
                style={{
                  color: '#007bff',
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                <div style={{ fontSize: '12px', color: '#666' }}>다음 글</div>
                <div style={{ marginTop: '4px' }}>
                  {nextPost.title.length > 30 ? nextPost.title.substring(0, 30) + '...' : nextPost.title} →
                </div>
              </Link>
            ) : (
              <div style={{ color: '#ccc' }}>
                <div style={{ fontSize: '12px' }}>다음 글</div>
                <div style={{ marginTop: '4px' }}>다음 글이 없습니다</div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/BoardList"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            게시판 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;
