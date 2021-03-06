import styled from 'styled-components';
import { VscFoldUp, VscFoldDown } from 'react-icons/vsc';
import { useCallback, useRef, useState } from 'react';
import React from 'react';
type QnAProps = {
  id: number;
  question: string;
  answer?: string;
  img?: string;
};
const QnA: React.FunctionComponent<QnAProps> = ({ id, question, answer, img }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const [isCollapse, setIsCollpase] = useState(false);
  const handleButtonClick = useCallback(
    (event) => {
      event.stopPropagation();
      if (parentRef.current === null || childRef.current === null) {
        return;
      }
      if (parentRef.current.clientHeight > 0) {
        parentRef.current.style.height = '0';
      } else {
        parentRef.current.style.height = `${childRef.current.clientHeight}px`;
      }
      setIsCollpase(!isCollapse);
    },
    [isCollapse],
  );

  return (
    <Container>
      <div className="question">
        <h5>
          Q{id}.{question}
        </h5>
        {isCollapse && (
          <button onClick={handleButtonClick}>
            <VscFoldUp />
          </button>
        )}
        {!isCollapse && (
          <button onClick={handleButtonClick}>
            <VscFoldDown size={'1em'} />
          </button>
        )}
      </div>

      <ContentsWrapper className="answer" ref={parentRef}>
        <Contents ref={childRef}>
          <div dangerouslySetInnerHTML={{ __html: answer ?? '' }}></div>
          {img && <img style={{ width: '100%', objectFit: 'contain' }} src={img} alt="이미지" />}
        </Contents>
      </ContentsWrapper>
    </Container>
  );
};

export default React.memo(QnA);

const Container = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  font-size: 1.5em;
  flex-direction: column;
  justify-content: center;
  max-width: 800px;
  button {
    position: absolute;
    top: 0.3em;
    right: 0;
  }
  margin-top: 1em;
`;

const ContentsWrapper = styled.div`
  height: 0;
  width: inherit;
  padding: 0 8px;
  overflow: hidden;

  transition: height 0.35s ease, background 0.35s ease;
`;

const Contents = styled.div`
  padding: 3% 5%;
  background-color: rgba(229, 229, 229, 0.4);
  p {
    font-weight: normal;
    font-size: 1rem;
    font-family: 'Noto Sans KR Light';
  }

  strong {
    color: ${(props) => props.theme.main};
  }

  b {
    color: #00c9a7;
  }
`;
