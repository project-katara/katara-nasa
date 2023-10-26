/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/*
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */

import 'worldwindjs';
import { v4 as uuidv4 } from 'uuid';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useQueryParam, StringParam } from 'use-query-params';

import { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'worldwind-react-globe';
import {
  student,
  teacher,
  logo,
  starIcon,
  chartIcon,
  downloadIcon,
  pinIcon,
} from './assets';

import { config } from './config';

import './App.css';

const WorldWind = window.WorldWind;

import HydroRIVERSColorLayer from './layers/HydroRIVERSColorLayer';
import HydroLAKESPolysColorLayer from './layers/HydroLAKESPolysColorLayer';
import BasinATLASColorLayer from './layers/BasinATLASColorLayer';
import GlobalRiverClassificationColorLayer from './layers/GlobalRiverClassificationColorLayer';
import LakeATLASPntColorLayer from './layers/LakeATLASPointColorLayer';
import LakeATLASPolygonColorLayer from './layers/LakeATLASPolygonColorLayer';
import TerrestrisLayer from './layers/TerrestrisLayer';
import GEBCOLayer from './layers/GEBCOLayer';

import useWindowDimensions from './hooks/useWindowDimensions';

export default function App() {
  const { height, width } = useWindowDimensions();
  const [socketUrl, setSocketUrl] = useState(
    `${config.websocket.host}/${uuidv4().replace(/-/g, '')}`
  );
  const [messageHistory, setMessageHistory] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [chosenLayer, setChosenLayer] = useState('GEBCO_LATEST');
  const [chatInput, setChatInput] = useState('');
  const [answerId, setAnswerId] = useState('');

  const [waitResponse, setWaitResponse] = useState(false);
  const [status, setStatus] = useState(true);
  const [step, setStep] = useState(0);
  const [globe, setGlobe] = useState(null);
  const [isGlobeHidden, setIsGlobeHidden] = useState(false);

  const [isTeacherUser, setIsTeacherUser] = useState(false);
  const [pickMap, setPickMap] = useState([]); // { name: 'nilo', latitude: 34.2, longitude: -119.2},
  const [menuLayers, setMenuLayers] = useState([
    // { name: 'Basin', value: 'BasinATLAS_v10' },
    { name: 'GEBCO', value: 'GEBCO_LATEST' },
    { name: 'Gloric', value: 'GloRiC_v10' },
    { name: 'Lakes', value: 'HydroLAKES_polys_v10' },
    { name: 'Rivers', value: 'HydroRIVERS_v10' },
    // { name: 'LAKE Point', value: 'LakeATLAS_v10_pnt' },
    // { name: 'LAKE Polygon', value: 'LakeATLAS_v10_pol' },
    { name: 'OMS', value: 'OSM-WMS' },
  ]);

  const [coordinates, setCoordinates] = useState({
    latitude: 34.2,
    longitude: -119.2,
  });

  const [roomIdQueryParams, setRoomIdQueryParams] = useQueryParam(
    'room',
    StringParam
  );

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const globeRef = useRef();

  const layers = [
    {
      layer: new HydroRIVERSColorLayer(),
      options: { category: 'overlay', enabled: false },
    },
    {
      layer: new HydroLAKESPolysColorLayer(),
      options: { category: 'overlay', enabled: false },
    },
    {
      layer: new BasinATLASColorLayer(),
      options: { category: 'overlay', enabled: false },
    },
    {
      layer: new GlobalRiverClassificationColorLayer(),
      options: { category: 'overlay', enabled: false },
    },
    {
      layer: new LakeATLASPntColorLayer(),
      options: { category: 'overlay', enabled: false },
    },
    {
      layer: new LakeATLASPolygonColorLayer(),
      options: { category: 'overlay', enabled: false },
    },
    {
      layer: new TerrestrisLayer(),
      options: { category: 'background', enabled: false },
    },
    {
      layer: new GEBCOLayer(),
      options: { category: 'background', enabled: true },
    },
    {
      layer: 'stars',
      options: { category: 'overlay', enabled: true },
    },
    {
      layer: 'atmosphere-day-night',
      options: { category: 'overlay', enabled: true },
    },
  ];

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const popup = document.querySelector('.popup-component');

  const globePartialOverlay = document.querySelector(
    '.partial-overlay.globe-partial-overlay'
  );

  let firstPredefinedAnswer =
    'The longest river in the world is the Nile River. It flows through northeastern Africa and is approximately 6,650 kilometers (4,130 miles) long. I will show the Nile River on the map! Zoom it to get all the details!';
  let secondPredefinedAnswer =
    'Climate change can cause more intense and frequent rainfall in some regions, leading to severe floods, while other areas may suffer from prolonged droughts due to reduced precipitation, impacting water availability for agriculture and communities! I can show to you the difference between the rainfalls 100 years ago and now to illustrate if you want to!';

  const handleChangeSelect = (event) => {
    handleHideLayer(chosenLayer);
    setChosenLayer(event.target.value);
  };

  const chatAnswerAnimation = (answerId, answer, filter = 'selector') => {
    if (answer === '' || answer === undefined) return;

    const addBreakLineAnswer = answer.replace(/\n/gi, '\n\n');

    let answerIdTemp =
      filter === 'selector'
        ? document.querySelector(`#${answerId}`)
        : document.getElementById(`${answerId}`);

    document
      .getElementById(`${answerId}`)
      .classList.remove('selected-answers-box__answer--loading');

    let i = 0;
    const timerId = setInterval(() => {
      answerIdTemp.innerHTML += addBreakLineAnswer.charAt(i);
      i++;
      if (i === addBreakLineAnswer.length) {
        clearInterval(timerId);
      }
    }, 40);
  };

  const updateZoom = () => {
    const globeWWD = globeRef.current;

    var wwd = globeWWD.wwd;

    wwd.keyboardControls.handleZoom('zoomIn');

    setTimeout(() => {
      wwd.keyboardControls.activeOperation = null;
    }, 2000);
  };

  const findIndexLayer = (layerName) => {
    if (globe) {
      const indexLayer = globe
        .getLayers()
        .findIndex((layer) => layer.displayName === layerName);

      return indexLayer;
    }

    return -1;
  };

  const handleClickSendMessage = useCallback(
    (message) => sendMessage(message),
    []
  );

  const handleOnSubmit = async () => {
    if (step >= 6) {
      setWaitResponse(true);
      const newQuestion = {
        id: `#question${uuidv4()}`,
        question: chatInput,
        answer: ' ',
      };

      newQuestion.id = newQuestion.id.replace(/-/gi, '');

      setQuestions((previousQuestion) => [...previousQuestion, newQuestion]);
    }
  };

  const handleNextStep = (step, isRoom) => {
    if (isRoom === true) {
      const roomId = socketUrl.replace(`${config.websocket.host}/`, '');
      setRoomIdQueryParams(roomId);
    }

    if (width < 1024 && !step) {
      setStep(6);
    } else {
      if (!step) {
        setStep((current) => current + 1);
      } else {
        handleHideLayer('HydroRIVERS_v10');
        handleHideLayer('OSM-WMS');
        handleHideLayer('HydroLAKES_polys_v10');
        handleShowLayer('GEBCO_LATEST');

        removePick(pickMap);

        setStep(6);
      }
    }
  };

  const handleGlobeState = () => {
    const GlobeWrapper = document.querySelector('.fullscreen');
    setIsGlobeHidden(!isGlobeHidden);
    if (isGlobeHidden) {
      GlobeWrapper.classList.remove('fullscreen--hidden');
    } else {
      GlobeWrapper.classList.add('fullscreen--hidden');
    }
  };

  const handleSelectedQuestions = (answerNumber, answerId) => {
    let answer = document.querySelector(`#${answerId}`);

    if (answer !== null) {
      answer.classList.add('selected-answers-box__answer--background');
    }

    if (answerNumber === 1) {
      handleShowLayer('HydroRIVERS_v10');
      handleShowLayer('OSM-WMS');
      handleHideLayer('GEBCO_LATEST');
      setCoordinates({ latitude: 29.533438, longitude: 31.270695 });
      setPickMap([{ name: 'Nile', latitude: 29.533438, longitude: 31.270695 }]);
      chatAnswerAnimation('firstPredefinedAnswer', firstPredefinedAnswer);
    } else if (answerNumber === 2) {
      removePick(pickMap);
      handleHideLayer('HydroRIVERS_v10');
      handleShowLayer('HydroLAKES_polys_v10');
      setCoordinates({ latitude: -23.5489, longitude: -46.6388 });
      chatAnswerAnimation('secondPredefinedAnswer', secondPredefinedAnswer);
    }
  };

  const handleOnChange = (e) => {
    if (step >= 6) {
      setChatInput(e.target.value);
    }
  };

  const handleShowLayer = (layerName) => {
    const indexLayer = findIndexLayer(layerName);
    if (indexLayer >= 0) globe.getLayers()[indexLayer].enabled = true;
  };

  const handleHideLayer = (layerName) => {
    const indexLayer = findIndexLayer(layerName);
    if (indexLayer >= 0) globe.getLayers()[indexLayer].enabled = false;
  };

  useEffect(() => {
    if (questions.length === 0) return;

    // const waitAnswer = questions.findIndex(
    //   (question) => question.answer === ' '
    // );

    if (waitResponse === true) {
      localStorage.setItem('questions', JSON.stringify(questions));

      const questionLength = questions.length - 1;
      const question = questions[questionLength];
      setAnswerId(question.id);
      chatAnswerAnimation(question.id, '', 'id');
    } else {
      if (lastMessage) {
        try {
          const message = JSON.parse(lastMessage.data);
          if (message['Answer'] !== undefined && message['Answer'] !== '') {
            localStorage.setItem('questions', JSON.stringify(questions));

            const questionLength = questions.length - 1;
            const question = questions[questionLength];
            chatAnswerAnimation(question.id, message.Answer, 'id');
            setAnswerId(question.id);
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    }
  }, [questions]);

  const removePick = (layersPick) => {
    const globeWWD = globeRef.current;
    const wwd = globeWWD.wwd;
    const layersGlobe = wwd.layers;

    for (let i = 0; i < layersPick.length; i++) {
      const layerPick = layersPick[i];

      for (let j = 0; j < layersGlobe.length; j++) {
        const layer = layersGlobe[j];

        if (layer.displayName == layerPick.name) {
          handleHideLayer(layerPick.name);
        }
      }
    }
  };

  const addPick = (name, latitude, longitude) => {
    const globeWWD = globeRef.current;
    const wwd = globeWWD.wwd;

    let pinLibrary = pinIcon; // location of the image files
    let placemark;
    let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
    let highlightAttributes;
    let placemarkLayer = new WorldWind.RenderableLayer(name);

    placemarkAttributes.imageScale = 1;
    placemarkAttributes.imageOffset = new WorldWind.Offset(
      WorldWind.OFFSET_FRACTION,
      0.3,
      WorldWind.OFFSET_FRACTION,
      0.0
    );

    placemarkAttributes.imageColor = WorldWind.Color.WHITE;
    placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
      WorldWind.OFFSET_FRACTION,
      0.5,
      WorldWind.OFFSET_FRACTION,
      1.0
    );

    placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
    placemarkAttributes.drawLeaderLine = true;
    placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

    placemark = new WorldWind.Placemark(
      new WorldWind.Position(latitude, longitude, 1e2),
      false,
      null
    );

    placemark.label = name;
    placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

    // Create the placemark attributes for this placemark. Note that the attributes differ only by their
    // image URL.
    placemarkAttributes = new WorldWind.PlacemarkAttributes(
      placemarkAttributes
    );

    placemarkAttributes.imageSource = pinLibrary;
    placemark.attributes = placemarkAttributes;

    // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
    // the default highlight attributes so that all properties are identical except the image scale. You could
    // instead vary the color, image, or other property to control the highlight representation.
    highlightAttributes = new WorldWind.PlacemarkAttributes(
      placemarkAttributes
    );
    highlightAttributes.imageScale = 1.2;
    placemark.highlightAttributes = highlightAttributes;

    // Add the placemark to the layer.
    placemarkLayer.addRenderable(placemark);

    wwd.addLayer(placemarkLayer);
  };

  useEffect(() => {
    if (pickMap.length > 0) {
      for (let i = 0; i < pickMap.length; i++) {
        const { name, latitude, longitude } = pickMap[i];

        addPick(name, latitude, longitude);
      }
    }
  }, [pickMap]);

  useEffect(() => {
    setGlobe(globeRef.current);

    const globeWWD = globeRef.current;

    var wwd = globeWWD.wwd;

    wwd.globe = new WorldWind.Globe(new WorldWind.ElevationModel());
    // This globe's equatorial radius in meters.
    wwd.globe.equatorialRadius = 3396200;
    var flattening = 0.00589;
    // This globe's polar radius in meters.
    wwd.globe.polarRadius = wwd.globe.equatorialRadius * (1 - flattening);
    //This globe's eccentricity squared.
    wwd.globe.eccentricitySquared = 2 * flattening - flattening * flattening;
  }, [globeRef]);

  useEffect(() => {
    if (step === 2 || step === 6) {
      setStatus(false);
    }

    if (step === 2) {
      popup.classList.remove('popup--disabled');
      popup.classList.add('popup--one');
    } else if (step === 3) {
      popup.classList.add('popup--two');
      popup.classList.remove('popup--one');
    } else if (step === 4) {
      popup.classList.add('popup--three');
      popup.classList.remove('popup--two');
    } else if (step === 5) {
      popup.classList.add('popup--final');
      popup.classList.remove('popup--three');
    } else if (step > 5) {
      popup.classList.add('popup--disabled');

      handleHideLayer('HydroRIVERS_v10');
      handleHideLayer('OSM-WMS');
      handleHideLayer('HydroLAKES_polys_v10');
      handleShowLayer('GEBCO_LATEST');
      removePick(pickMap);
    }
  }, [step]);

  useEffect(() => {
    if (globePartialOverlay !== null) {
      globePartialOverlay.classList.add('globe-partial-overlay--disabled');
    }

    const globeWWD = globeRef.current;

    globeWWD.wwd.goToAnimator.goTo(
      new WorldWind.Location(coordinates.latitude, coordinates.longitude)
    );
  }, [coordinates]);

  useEffect(() => {
    try {
      if (answerId == '') return;

      let answer = document.getElementById(answerId);

      if (answer !== null) {
        answer.classList.add('selected-answers-box__answer--background');
      }

      if (answer.innerHTML == null || answer.innerHTML == '') {
        answer.classList.add('selected-answers-box__answer--loading');
      }

      if (waitResponse === true) {
        const updateQuestion = [...questions];
        const indexQuestion = updateQuestion.findIndex(
          (question) => question.id === answerId
        );

        handleClickSendMessage(chatInput);
        updateQuestion[indexQuestion].answer = '';
        setChatInput('');
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [answerId]);

  useEffect(() => {
    if (messageHistory.length === 0) return;

    const lastIndex = messageHistory.length - 1;
    const lastMessageHistory = messageHistory[lastIndex];

    try {
      const message = JSON.parse(lastMessageHistory.data);

      if (
        roomIdQueryParams !== '' &&
        roomIdQueryParams !== undefined &&
        message['Answer'] !== undefined &&
        message['Answer'] !== ''
      ) {
        if (waitResponse === false) {
          const newQuestion = {
            id: `#question${uuidv4()}`,
            question: message.Prompt,
            answer: message.Answer,
          };

          newQuestion.id = newQuestion.id.replace(/-/gi, '');

          setQuestions((previousQuestion) => [
            ...previousQuestion,
            newQuestion,
          ]);
        } else {
          const updateAnswerQuestion = [...questions];
          updateAnswerQuestion[questions.length - 1].answer = message.Answer;

          setQuestions(updateAnswerQuestion);
          setWaitResponse(false);
        }
      } else {
        setWaitResponse(false);
        chatAnswerAnimation(answerId, message.Answer, 'id');
      }

      setChatInput('');
    } catch (error) {
      console.log('error', error);
    }
  }, [messageHistory]);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  useEffect(() => {
    if (roomIdQueryParams !== '' && roomIdQueryParams !== undefined) {
      setSocketUrl(
        `${config.websocket.host}/${roomIdQueryParams}/${uuidv4().replace(
          /-/g,
          ''
        )}`
      );

      setStep(1);
    }
  }, []);

  useEffect(() => {
    setStatus(true);
  }, [isTeacherUser]);

  useEffect(() => {
    handleShowLayer(chosenLayer);
  }, [chosenLayer]);

  return (
    <>
      {status === true ? (
        <div className='global-overlay'>
          <div className='modal-wrapper'>
            <div className='modal-wrapper__glass'>
              <div className='modal-wrapper__container'>
                <div className='modal-content'>
                  {step == 0 && (
                    <>
                      <div className='modal-content__header'>
                        <h2 className='modal-content__title'>
                          Welcome to Water LLM!
                        </h2>
                        <p className='modal-content__description'>
                          Please select your role, your choice will help us
                          customize your experience for maximum effectiveness
                          within our learning environment.
                        </p>
                      </div>
                      <div className='user-type-box'>
                        <div className='user-type-box__item'>
                          <h2>Student</h2>
                          <img
                            src={student}
                            className='user-type-box__item__img'
                            onClick={() => handleNextStep('', false)}
                          />
                        </div>
                        <div className='user-type-box__item'>
                          <h2>Teacher</h2>
                          <img
                            src={teacher}
                            className='user-type-box__item__img'
                            onClick={() => {
                              handleNextStep('', true);
                              setIsTeacherUser(true);
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {step == 1 && isTeacherUser === true && (
                    <>
                      <div className='modal-content__header'>
                        <h2 className='modal-content__title'>
                          You are now in a class room!
                        </h2>
                        <p className='modal-content__description'>
                          You can share the link of this page to your students
                          and you can all collaborate! The idea is to have a
                          collaborative space and to watch together Katara's
                          answers.
                        </p>
                        <div className='modal-content__input-box'>
                          <input className='modal-content__input' />
                          <div className='modal-content__button-wrapper'>
                            <button className='modal-content__button'>
                              <svg
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M20.3116 12.6473L20.8293 10.7154C21.4335 8.46034 21.7356 7.3328 21.5081 6.35703C21.3285 5.58657 20.9244 4.88668 20.347 4.34587C19.6157 3.66095 18.4881 3.35883 16.2331 2.75458C13.978 2.15033 12.8504 1.84821 11.8747 2.07573C11.1042 2.25537 10.4043 2.65945 9.86351 3.23687C9.27709 3.86298 8.97128 4.77957 8.51621 6.44561C8.43979 6.7254 8.35915 7.02633 8.27227 7.35057L8.27222 7.35077L7.75458 9.28263C7.15033 11.5377 6.84821 12.6652 7.07573 13.641C7.25537 14.4115 7.65945 15.1114 8.23687 15.6522C8.96815 16.3371 10.0957 16.6392 12.3508 17.2435L12.3508 17.2435C14.3834 17.7881 15.4999 18.0873 16.415 17.9744C16.5152 17.9621 16.6129 17.9448 16.7092 17.9223C17.4796 17.7427 18.1795 17.3386 18.7203 16.7612C19.4052 16.0299 19.7074 14.9024 20.3116 12.6473Z'
                                  stroke='#1C274C'
                                  strokeWidth='1.5'
                                />
                                <path
                                  opacity='0.5'
                                  d='M16.415 17.9741C16.2065 18.6126 15.8399 19.1902 15.347 19.6519C14.6157 20.3368 13.4881 20.6389 11.2331 21.2432C8.97798 21.8474 7.85044 22.1495 6.87466 21.922C6.10421 21.7424 5.40432 21.3383 4.86351 20.7609C4.17859 20.0296 3.87647 18.9021 3.27222 16.647L2.75458 14.7151C2.15033 12.46 1.84821 11.3325 2.07573 10.3567C2.25537 9.58627 2.65945 8.88638 3.23687 8.34557C3.96815 7.66065 5.09569 7.35853 7.35077 6.75428C7.77741 6.63996 8.16368 6.53646 8.51621 6.44531'
                                  stroke='#1C274C'
                                  strokeWidth='1.5'
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className='modal-content__description'>
                          Now we'll guide you through all Katara's features.
                        </p>
                      </div>
                      <div
                        className='button-wrapper'
                        onClick={() => handleNextStep()}
                      >
                        <div className='button-wrapper__container'>
                          <button className='button-container__item'>
                            Follow tutorial
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {step == 1 && isTeacherUser === false && (
                    <>
                      <div className='modal-content__header'>
                        <h2 className='modal-content__title'>
                          Nice to have you!
                        </h2>
                        {width > 1024 ? (
                          <p className='modal-content__description'>
                            We have a ready to go tutorial for you. We'll guide
                            you through all Katara's features.
                          </p>
                        ) : (
                          <p className='modal-content__description'>
                            We've set up the best environment for your device
                            and now you can use all of Katara's features.
                          </p>
                        )}
                      </div>

                      <div
                        className='button-wrapper'
                        onClick={() => handleNextStep()}
                      >
                        <div className='button-wrapper__container'>
                          <button className='button-container__item'>
                            {`${
                              width > 1024
                                ? 'Follow tutorial'
                                : 'Explorer of the globe'
                            }`}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <div className='wrapper'>
        <div className='container'>
          <div className='popup-component popup--disabled'>
            <div className='popup-component__wrapper'>
              <div className='popup-component__wrapper__container'>
                {step < 5 && (
                  <div className='popup-number-wrapper'>
                    <div className='popup-number-wrapper__container'>
                      <h3 className='popup-number'>{step - 1}</h3>
                    </div>
                  </div>
                )}
                <div className='popup-header'>
                  {step === 5 && (
                    <div className='popup-icon-wrapper'>
                      <div className='popup-icon-wrapper__container'>
                        <img
                          src={starIcon}
                          className='popup-icon-wrapper__container__icon'
                        />
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    <>
                      <h3 className='popup-title'>Explore Earth</h3>
                      <p className='popup-description'>
                        Get started by clicking, dragging, and zooming to
                        explore the Katara Earth Globe!
                      </p>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <h3 className='popup-title'>Ask Katara a Question</h3>
                      <p className='popup-description'>
                        Click on a suggested message to get a answer and Katara
                        will instantly generate a relevant map to the question!
                      </p>
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <h3 className='popup-title'>Exploring: Climate Change</h3>
                      <p className='popup-description'>
                        Click on a suggested message to delve into a example the
                        impact of climate change on water resources!
                      </p>
                    </>
                  )}
                  {step === 5 && (
                    <>
                      <h3 className='popup-title'>Awesome!</h3>
                      <p className='popup-description'>
                        Experience Project Katara freely now!
                      </p>
                    </>
                  )}
                </div>
                <div className='popup-button-wrapper'>
                  {step === 5 ? (
                    <button
                      className='popup-button-wrapper__item'
                      onClick={() => handleNextStep()}
                    >
                      Finish tutorial 4 / 4
                    </button>
                  ) : (
                    <button
                      className='popup-button-wrapper__item'
                      onClick={() => handleNextStep()}
                    >
                      Skip {step - 1} / 4
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='chat-component'>
            {step === 2 ? <div className='partial-overlay'></div> : ''}
            <div className='chat-wrapper'>
              {step >= 6 ? (
                <div className='globe-state-box'>
                  <p>Globe display</p>
                  <div
                    className='button-wrapper button-wrapper--globe-state button-wrapper--show-globe'
                    onClick={() => handleGlobeState()}
                  >
                    <div className='button-wrapper__container'>
                      <button className='button-container__item'>
                        Show globe
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
              <div className='chat-wrapper__glass'>
                <div className='chat-wrapper__container'>
                  <img className='logo' src={logo} />
                  <div id='#chat' className='chat-content'>
                    <div>
                      {step < 6 ? (
                        <>
                          <div className='selected-questions-box'>
                            <div
                              className='selected-questions-box__item'
                              onClick={() =>
                                handleSelectedQuestions(
                                  1,
                                  'firstPredefinedAnswer'
                                )
                              }
                            >
                              <div className='selected-questions-box__item__wrapper'>
                                <div className='selected-question-container'>
                                  <p className='selected-question-container__text'>
                                    Show me the longest river in the world
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='selected-answers-box'>
                            <p
                              className='selected-answers-box__answer'
                              id='firstPredefinedAnswer'
                            ></p>
                          </div>
                          {step > 3 && (
                            <>
                              <div className='selected-questions-box'>
                                <div
                                  className='selected-questions-box__item'
                                  onClick={() =>
                                    handleSelectedQuestions(
                                      2,
                                      'secondPredefinedAnswer'
                                    )
                                  }
                                >
                                  <div className='selected-questions-box__item__wrapper'>
                                    <div className='selected-question-container'>
                                      <p className='selected-question-container__text'>
                                        How the climate change impact on water?
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='selected-answers-box'>
                                <p
                                  className='selected-answers-box__answer'
                                  id='secondPredefinedAnswer'
                                ></p>
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {questions.length > 0
                            ? questions.map((data) => (
                                <div key={data.id}>
                                  <div className='selected-questions-box'>
                                    <div className='selected-questions-box__item'>
                                      <div className='selected-questions-box__item__wrapper'>
                                        <div className='selected-question-container'>
                                          <p className='selected-question-container__text'>
                                            {data.question}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='selected-answers-box'>
                                    <p className='selected-answers-box__answer'>
                                      <span
                                        className='answer-content'
                                        id={data.id}
                                      ></span>
                                      <span className='dot-flashing-wrapper'>
                                        <span className='dot-flashing'></span>
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              ))
                            : ''}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className='chat-input-box'>
                  <div className='chat-input-box__container'>
                    <input
                      value={chatInput}
                      placeholder={
                        step >= 6
                          ? 'Ask Katara...'
                          : 'You can type when the tutorial is completed!'
                      }
                      className='chat-input-box__item'
                      onChange={(e) => handleOnChange(e)}
                    />
                    <div className='chat-input-box__button'>
                      <svg
                        onClick={() => handleOnSubmit()}
                        width='21'
                        height='26'
                        viewBox='0 0 21 26'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M17.7977 11.6005L4.6727 4.10909C4.45146 3.98499 4.1977 3.93113 3.94512 3.95468C3.69254 3.97823 3.45311 4.07806 3.25862 4.24092C3.06414 4.40379 2.9238 4.62197 2.85627 4.86648C2.78873 5.111 2.79719 5.37028 2.88051 5.60987L5.30239 12.6778C5.30208 12.6804 5.30208 12.6831 5.30239 12.6857C5.30195 12.6882 5.30195 12.6909 5.30239 12.6935L2.88051 19.7771C2.81378 19.9655 2.79324 20.1673 2.8206 20.3653C2.84796 20.5634 2.92244 20.752 3.03777 20.9153C3.15311 21.0786 3.30594 21.2119 3.48343 21.3039C3.66093 21.396 3.85792 21.4441 4.05785 21.4442C4.27478 21.4437 4.4879 21.3872 4.6766 21.2802L17.7946 13.7763C17.9881 13.6679 18.1492 13.51 18.2616 13.3187C18.3739 13.1275 18.4333 12.9098 18.4337 12.688C18.4341 12.4662 18.3754 12.2483 18.2638 12.0566C18.1522 11.865 17.9916 11.7065 17.7985 11.5974L17.7977 11.6005ZM4.05785 20.1942V20.1872L6.41254 13.3192H10.9329C11.0986 13.3192 11.2576 13.2534 11.3748 13.1362C11.492 13.019 11.5579 12.86 11.5579 12.6942C11.5579 12.5285 11.492 12.3695 11.3748 12.2523C11.2576 12.1351 11.0986 12.0692 10.9329 12.0692H6.41879L4.06254 5.20362L4.05785 5.19425L17.1829 12.681L4.05785 20.1942Z'
                          fill='white'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='fullscreen'>
            {step >= 6 ? (
              <>
                <div className='layers-control-box'>
                  <FormControl
                    className='layers-control-box__form'
                    sx={{ m: 1, minWidth: 120 }}
                  >
                    <Select
                      value={chosenLayer}
                      onChange={handleChangeSelect}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      $
                      {menuLayers.length > 0
                        ? menuLayers.map((layerMenu) => (
                            <MenuItem
                              key={layerMenu.value}
                              id='layer-selection-item'
                              value={layerMenu.value}
                            >
                              <em>{layerMenu.name}</em>
                            </MenuItem>
                          ))
                        : ''}
                    </Select>
                    {/* <FormHelperText>Select a map layer!</FormHelperText> */}
                  </FormControl>
                </div>
                <div className='globe-state-box globe-state-box--hide-globe'>
                  <p>Globe display</p>
                  <div
                    className='button-wrapper button-wrapper--globe-state button-wrapper--hide-globe'
                    onClick={() => handleGlobeState()}
                  >
                    <div className='button-wrapper__container'>
                      <button className='button-container__item'>
                        Hide globe
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ''
            )}
            <div className='ui-actions-box'>
              <div
                className='ui-actions-box__item'
                data-action-text='Download as CSV: upcoming feature.'
                onClick={() => {}}
              >
                <a className='ui-actions-box__item__link'>
                  <img src={downloadIcon} />
                </a>
              </div>
              <div
                className='ui-actions-box__item'
                data-action-text='Charts: upcoming feature.'
              >
                <a className='ui-actions-box__item__link'>
                  <img src={chartIcon} />
                </a>
              </div>
            </div>
            {step !== 6 && (
              <div
                className='button-wrapper button-wrapper--skip-tutorial'
                onClick={() => handleNextStep('finish')}
              >
                <div className='button-wrapper__container'>
                  <button className='button-container__item'>
                    Skip tutorial
                  </button>
                </div>
              </div>
            )}

            {step === 3 ? (
              <div className='partial-overlay globe-partial-overlay'></div>
            ) : (
              ''
            )}
            <Globe
              ref={globeRef}
              layers={layers}
              latitude={coordinates.latitude}
              longitude={coordinates.longitude}
              // altitude={10e6}
            />
          </div>
        </div>
      </div>
    </>
  );
}
