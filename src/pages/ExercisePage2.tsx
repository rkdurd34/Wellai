import { WebCam, Video, Description, ExerciseResultModal } from 'components';
import { Row, Col, Button, Progress, message, Tooltip } from 'antd';
import styled from 'styled-components';
import { TensorCam, Loading } from 'components/exercise';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { CourseApi } from 'api/CourseApi';
import { UserApi } from 'api/UserApi';
import { exercise } from 'api/common';
import { ImportOutlined, CheckCircleFilled } from '@ant-design/icons';
import moment from 'moment';

const EXERCISE_TIME = 60;
const TIME_LIMIT = EXERCISE_TIME * 4 + 3;
const TEST_TIME_LIMIT = 3;
type exerciseTimeType = {
  name: string;
  time: number;
};
const ExcercisePage = () => {
  const alertUser = (e: any) => {
    e.preventDefault();
    e.returnValue = '';
  };

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser);
    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, []);
  const { id } = useParams();

  const [exerciseData, setExerciseData] = useState<exercise>();
  const exerciseDataRef = useRef<exercise>();
  const navigate = useNavigate();
  const course = CourseApi();
  const user = UserApi();
  const [userPoseIndex, setUserPoseIndex] = useState(-1);
  const userPoseIndexRef = useRef(-1);
  const [timeLimit, setTimeLimit] = useState(TIME_LIMIT);
  const timeLimitRef = useRef(TIME_LIMIT);
  const [timeCounter, setTimeCounter] = useState(EXERCISE_TIME); //
  const timeCounterRef = useRef(EXERCISE_TIME);
  const [totalTimeCounter, setTotalTimeCounter] = useState(0);
  const totalTimeCounterRef = useRef(0);
  const [courseList, setCourseList] = useState(['57', '57']);
  const courseListRef = useRef(['58']);
  const [isTestFinish, setIsTestFinish] = useState(0);
  const isTestFinishRef = useRef(0);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const isResultModalVisibleRef = useRef(false);
  const [exerciseResultMap, setExerciseResultMap] = useState<exerciseTimeType[]>([]);
  const exerciseResultMapRef = useRef<exerciseTimeType[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [countDown, setCountDown] = useState(3);
  // console.log(exerciseResultMap);
  useEffect(() => {
    course
      .getDetailInformation(id as string)
      .then((res) => {
        setCourseList((courseListRef.current = ['58', ...res.data.exercises]));
        const exerciseList = res.data.description.split('/n').map((item) => item.split(':')[0].trim());

        setExerciseResultMap((exerciseResultMapRef.current = exerciseList.map((item) => ({ name: item, time: 0 }))));
        setUserPoseIndex((userPoseIndexRef.current = 0));
      })
      .catch((err) => console.log(err.response));
    return () => {
      return user.recordExerciseTime(moment().format('YYYY-MM-DD'), String(totalTimeCounterRef.current));
    };
  }, []);

  useEffect(() => {
    setCountDown(3);
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    if (userPoseIndexRef.current !== -1) {
      course
        .getExercise(courseListRef.current[userPoseIndexRef.current as number])
        .then((res) => {
          return setExerciseData((exerciseDataRef.current = res.data));
        })
        .catch((err) => console.log(err.response));
    }
    return () => clearTimeout(loadingTimeout);
  }, [userPoseIndex]);

  const handleNextExercise = () => {
    setIsLoading(true);
    setUserPoseIndex((userPoseIndexRef.current += 1));
    setTimeCounter(
      userPoseIndexRef.current === 0
        ? (timeCounterRef.current = EXERCISE_TIME)
        : (timeCounterRef.current = EXERCISE_TIME),
    );
    setTimeLimit(
      userPoseIndexRef.current === 0 ? (timeLimitRef.current = TIME_LIMIT) : (timeLimitRef.current = TIME_LIMIT),
    );
  };
  const handleExitExercisePage = () => {
    setIsResultModalVisible((isResultModalVisibleRef.current = true));
    return;
  };
  return (
    <Wrapper>
      <ExerciseResultModal
        isResultModalVisible={isResultModalVisible}
        setIsResultModalVisible={setIsResultModalVisible}
        exerciseResultMap={exerciseResultMap}
        totalTimeCounter={totalTimeCounter}
        courseDetailId={id}
        totalTimeLimit={EXERCISE_TIME * (courseList.length - 1)}
        EXERCISE_TIME={EXERCISE_TIME}
      />
      <Loading isLoading={isLoading} countDown={countDown} setCountDown={setCountDown} userPoseIndex={userPoseIndex} />
      <Row justify="space-between" style={{ padding: '15px 15px' }}>
        <Col span={12}>
          <Row>
            <Col style={{ marginRight: '20px' }}>
              <Button style={{ borderRadius: '5px' }} type="primary" size="large" onClick={handleExitExercisePage}>
                <ImportOutlined />
                ????????? ?????????
              </Button>
            </Col>
            <Col>
              <Button
                disabled={userPoseIndex === courseList.length - 1 || userPoseIndex == 0 ? true : false}
                style={{ borderRadius: '5px' }}
                type="primary"
                size="large"
                onClick={handleNextExercise}
              >
                ?????? ????????????
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row justify="center" align="middle">
            <Col style={{ marginRight: '20px', fontSize: '20px' }}>????????????</Col>
            <Col span={15}>
              <Progress
                strokeColor={{
                  '0%': '#ff7273',
                  '100%': '#FFA07A',
                }}
                // percent={Number(((totalTimeCounterRef.current / (EXERCISE_TIME * courseList.length)) * 100).toFixed())}
                percent={Number(((userPoseIndexRef.current / courseListRef.current.length) * 100).toFixed())}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="space-around">
        <Col span={24}>
          <Row justify="center" align="middle">
            <Col span={12} style={{ paddingLeft: '30px' }}>
              <Row justify="center" align="middle" style={{ marginBottom: '20px' }}>
                <Col
                  style={{
                    fontSize: '30px',
                    color: '#ff7273',
                    fontWeight: 'bold',
                  }}
                >
                  {userPoseIndex == 0 ? `????????? ??????` : exerciseData?.exercise_name}
                </Col>
              </Row>
              <Row
                style={{
                  padding: '10px 10px',
                  fontSize: '17px',
                }}
              >
                <Col>
                  <Row>
                    <Col>
                      1. <b>????????? ???????????? ?????? ??? ?????? ??????</b>?????? ????????? ????????? ?????????.
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      2. ????????? ????????? ????????? ?????? ?????? ????????? ?????? ??? ?????? ?????????
                      <b style={{ color: '#00C9A7' }}> ?????????</b>
                      ?????? ????????? ?????????.
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      3. ??? ?????? ?????? <b>??? ???????????? 1???</b>??? ?????? ?????????. (????????? ?????? ?????? ????????? ?????? ????????? ??????)
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            {userPoseIndex === 0 ? (
              <Col span={12}>
                <Row
                  justify="center"
                  style={{
                    fontSize: '22px',
                  }}
                >
                  <Col>
                    {isTestFinishRef.current >= TEST_TIME_LIMIT ? (
                      <>
                        <b>3??? </b>?????? ????????? <b>???????????? </b> ???????????????
                      </>
                    ) : (
                      <>
                        <b>????????? ???????????? ?????? ??? ?????? ??????</b>?????? ????????? ????????? <b>{TEST_TIME_LIMIT}???</b>???
                        ??????????????????.
                      </>
                    )}
                  </Col>
                </Row>
                <Row justify="center" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Col span={10} style={{ fontSize: '20px' }}>
                    <Progress
                      percent={Number(((isTestFinish / TEST_TIME_LIMIT) * 100).toFixed())}
                      size="small"
                      format={(percent) => {
                        if (percent !== undefined && percent < 100) {
                          return <Col style={{ fontSize: '20px' }}>{(3 * (Number(percent) / 100)).toFixed()}???</Col>;
                        } else if (percent !== undefined && percent >= 100) {
                          return <CheckCircleFilled style={{ fontSize: '20px' }} />;
                        }
                      }}
                    />
                  </Col>
                </Row>
                <Row justify="center">
                  <Col>
                    <Tooltip
                      title="????????? ???????????? ???????????? ?????? ????????? ???????????????"
                      placement="bottom"
                      overlayInnerStyle={{ width: '310px', borderRadius: '10px' }}
                    >
                      <Button size="large" type="primary" style={{ borderRadius: '5px' }} onClick={handleNextExercise}>
                        ????????? ????????????
                      </Button>
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
            ) : (
              <Col span={12}>
                <Row justify="center" align="middle">
                  <Col
                    style={{
                      padding: '3px 20px',
                    }}
                  >
                    <Row>
                      <Col style={{ marginRight: '80px' }}>
                        <Row>
                          <Col>
                            <Progress
                              strokeColor={{
                                '0%': '#fabfa8',
                                '100%': '#ff7273',
                              }}
                              type="circle"
                              percent={(timeLimitRef.current / TIME_LIMIT) * 100}
                              format={(percent) => (
                                <>
                                  <div>????????????</div>
                                  <div style={{ fontSize: '40px' }}>
                                    {((TIME_LIMIT * Number(percent)) / 100).toFixed()}
                                  </div>
                                </>
                              )}
                              success={{
                                percent: 0,
                                strokeColor: '#ff7273',
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col style={{ marginRight: '80px' }}>
                        <Row>
                          <Col>
                            <Progress
                              strokeColor={{
                                '0%': '#fabfa8',
                                '100%': '#ff7273',
                              }}
                              type="circle"
                              percent={((EXERCISE_TIME - timeCounter) / EXERCISE_TIME) * 100}
                              format={(percent) => (
                                <>
                                  <div>????????????</div>
                                  <div style={{ fontSize: '40px' }}>
                                    {((EXERCISE_TIME * Number(percent)) / 100).toFixed()}
                                  </div>
                                </>
                              )}
                              success={{
                                percent: 0,
                                strokeColor: '#ff7273',
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <Col>
                            <Progress
                              strokeColor={{
                                '0%': '#fabfa8',
                                '100%': '#ff7273',
                              }}
                              type="circle"
                              percent={(totalTimeCounter / (EXERCISE_TIME * (courseListRef.current.length - 1))) * 100}
                              format={(percent) => (
                                <>
                                  <div>???????????????</div>
                                  <div style={{ fontSize: '40px' }}>
                                    {(
                                      (Number(percent) / 100) *
                                      EXERCISE_TIME *
                                      (courseListRef.current.length - 1)
                                    ).toFixed()}
                                  </div>
                                </>
                              )}
                              success={{
                                percent: 0,
                                strokeColor: '#ff7273',
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
      <Row style={{ height: '65vh', marginTop: '30px', backgroundColor: 'black' }} align="middle">
        {userPoseIndexRef.current === 0 ? (
          <Col span={12} style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <img
              src="/image/sitting.jpeg"
              alt=""
              style={{
                objectFit: 'cover',
              }}
            />
          </Col>
        ) : (
          <Col span={12} style={{ height: '100%' }}>
            {exerciseData?.youtube_key ? <Video url={exerciseData?.youtube_key as string} /> : null}
            {/* <Video url={exerciseData?.youtube_key as string} /> */}
          </Col>
        )}

        <Col span={12} style={{ height: '100%' }}>
          <TensorCam
            timeLimit={timeLimit}
            setTimeLimit={setTimeLimit}
            timeCounter={timeCounter}
            setTimeCounter={setTimeCounter}
            userPoseIndex={userPoseIndex}
            setUserPoseIndex={setUserPoseIndex}
            totalTimeCounter={totalTimeCounter}
            setTotalTimeCounter={setTotalTimeCounter}
            courseList={courseList}
            setCourseList={setCourseList}
            exerciseDataRef={exerciseDataRef}
            id={id}
            timeLimitRef={timeLimitRef}
            userPoseIndexRef={userPoseIndexRef}
            timeCounterRef={timeCounterRef}
            totalTimeCounterRef={totalTimeCounterRef}
            courseListRef={courseListRef}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            isTestFinishRef={isTestFinishRef}
            isTestFinish={isTestFinish}
            setIsTestFinish={setIsTestFinish}
            EXERCISE_TIME={EXERCISE_TIME}
            TIME_LIMIT={TIME_LIMIT}
            TEST_TIME_LIMIT={TEST_TIME_LIMIT}
            isResultModalVisibleRef={isResultModalVisibleRef}
            setIsResultModalVisible={setIsResultModalVisible}
            exerciseResultMapRef={exerciseResultMapRef}
            setExerciseResultMap={setExerciseResultMap}
          />
        </Col>
      </Row>
    </Wrapper>
  );
};

export default ExcercisePage;
const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  min-width: 100%;
  b {
    color: ${(props) => props.theme.main};
  }
`;
