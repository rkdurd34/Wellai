import styled from 'styled-components';

import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { MyPageLayout } from 'components';
import { UserReviewDiv } from 'components/mypage';
import { CourseApi } from 'api';
import { UserReviewType } from 'type';
import { MyPageLoading } from 'components';
const MyPageComment = () => {
  const [reviewData, setReviewData] = useState<UserReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getUserReview() {
      const course = CourseApi();
      await course.getUserReview().then((res) => {
        setReviewData(res.data);
        setLoading(false);
      });
    }
    getUserReview();
  }, []);

  const handleRemoveReview = (id: string) => {
    setReviewData((current) => {
      const newReviewData = [];
      for (let i = 0; i < current.length; i++) {
        if (current[i].id === id) continue;
        newReviewData.push(current[i]);
      }
      return newReviewData;
    });
  };

  return (
    <Wrapper>
      <Row
        justify="space-between"
        style={{
          minWidth: '1350px',
          maxWidth: '1350px',
        }}
      >
        <Col>
          <MyPageLayout />
        </Col>
        <Col
          style={{
            width: 'calc(100% - 332px)',
          }}
        >
          <Row
            style={{
              paddingTop: '30px',
              marginLeft: '47px',
            }}
          >
            <Col style={{ fontSize: '20px' }}>내 댓글 보관함</Col>
          </Row>
          {loading ? (
            <MyPageLoading />
          ) : (
            <Row>
              <Col style={{ width: '800px', marginLeft: '47px' }}>
                <UserReviewDiv reviewData={reviewData} loading={loading} onRemove={handleRemoveReview} />
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Wrapper>
  );
};

export default MyPageComment;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
`;
