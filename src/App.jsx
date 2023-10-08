/*
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */

import "worldwindjs";
import { v4 as uuidv4 } from "uuid";

import { useEffect, useRef, useState } from "react";
import Globe from "worldwind-react-globe";
import student from "./assets/student.png";
import teacher from "./assets/teacher.png";
import logo from "./assets/water_llm_logo.png";
import starIcon from "./assets/icon_tutorial_start.png";
import chartIcon from "./assets/icon_tutorial_chart.png";
import downloadIcon from "./assets/icon_tutorial_download.png";
import "./App.css";

const WorldWind = window.WorldWind;

import HydroRIVERSColorLayer from "./layers/HydroRIVERSColorLayer";
import HydroLAKESPolysColorLayer from "./layers/HydroLAKESPolysColorLayer";
import BasinATLASColorLayer from "./layers/BasinATLASColorLayer";
import GlobalRiverClassificationColorLayer from "./layers/GlobalRiverClassificationColorLayer";
import LakeATLASPntColorLayer from "./layers/LakeATLASPointColorLayer";
import LakeATLASPolygonColorLayer from "./layers/LakeATLASPolygonColorLayer";

export default function App() {
  const [answerId] = useState(`answer-${uuidv4()}`);
  const [questionId] = useState(`question-${uuidv4()}`);

  const [status, setStatus] = useState(true);
  const [step, setStep] = useState(0);
  const [globe, setGlobe] = useState(null);
  const [coordinates, setCoordinates] = useState({
    latitude: 34.2,
    longitude: -119.2,
  });

  const [questions, setQuestions] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const handleOnChange = (e) => {
    setChatInput(e.target.value);
  };

  const handleOnSubmit = () => {
    setQuestions((previousQuestion) => [...previousQuestion, chatInput]);
  };

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
    console.log(uuidv4());
  }, [questions]);

  const globeRef = useRef();

  const popup = document.querySelector(".popup-component");

  const globePartialOverlay = document.querySelector(
    ".partial-overlay.globe-partial-overlay"
  );
  let firstPredefinedAnswer =
    "The longest river in the world is the Nile River. It flows through northeastern Africa and is approximately 6,650 kilometers (4,130 miles) long. I will show the Nile River on the map! Zoom it to get all the details!";
  let secondPredefinedAnswer =
    "Climate change can cause more intense and frequent rainfall in some regions, leading to severe floods, while other areas may suffer from prolonged droughts due to reduced precipitation, impacting water availability for agriculture and communities! I can show to you the difference between the rainfalls 100 years ago and now to illustrate if you want to!";

  const layers = [
    {
      layer: new HydroRIVERSColorLayer(),
      options: { category: "overlay", enabled: false },
    },
    {
      layer: new HydroLAKESPolysColorLayer(),
      options: { category: "overlay", enabled: false },
    },
    {
      layer: new BasinATLASColorLayer(),
      options: { category: "overlay", enabled: false },
    },
    {
      layer: new GlobalRiverClassificationColorLayer(),
      options: { category: "overlay", enabled: false },
    },
    {
      layer: new LakeATLASPntColorLayer(),
      options: { category: "overlay", enabled: false },
    },
    {
      layer: new LakeATLASPolygonColorLayer(),
      options: { category: "overlay", enabled: false },
    },
    "stars",
    "atmosphere-day-night",
  ];

  const handleNextStep = (step) => {
    if (!step) {
      setStep((current) => current + 1);
    } else {
      setStep(6);
    }
  };

  const chatAnswerAnimation = (answerId, answer) => {
    let i = 0;
    let answerIdTemp = document.querySelector(`#${answerId}`);

    const timerId = setInterval(() => {
      answerIdTemp.innerHTML += answer.charAt(i);
      i++;
      if (i === answer.length) {
        clearInterval(timerId);
      }
    }, 40);
  };

  const handleSelectedQuestions = (answerNumber, answerId) => {
    let answer = document.querySelector("#" + `${answerId}`);

    if (answer !== null) {
      answer.classList.add("selected-answers-box__answer--background");
    }

    if (answerNumber === 1) {
      handleShowLayer("HydroRIVERS_v10");
      setCoordinates({ latitude: 29.533438, longitude: 31.270695 });
      chatAnswerAnimation("firstPredefinedAnswer", firstPredefinedAnswer);
    } else if (answerNumber === 2) {
      chatAnswerAnimation("secondPredefinedAnswer", secondPredefinedAnswer);
    }
  };

  const findIndexLayer = (layerName) => {
    const indexLayer = globe
      .getLayers()
      .findIndex((layer) => layer.displayName === layerName);

    return indexLayer;
  };

  const handleShowLayer = (layerName) => {
    const indexLayer = findIndexLayer(layerName);
    globe.getLayers()[indexLayer].enabled = true;

    console.log(globe);
  };

  const handleHideLayer = (layerName) => {
    const indexLayer = findIndexLayer(layerName);

    globe.getLayers()[indexLayer].enabled = false;
  };

  useEffect(() => {
    setGlobe(globeRef.current);

    const globeWWD = globeRef.current;

    var wwd = globeWWD.wwd;

    //
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
    if (step === 2) {
      setStatus(false);
    }

    if (step === 2) {
      popup.classList.remove("popup--disabled");
      popup.classList.add("popup--one");
    } else if (step === 3) {
      popup.classList.add("popup--two");
      popup.classList.remove("popup--one");
    } else if (step === 4) {
      popup.classList.add("popup--three");
      popup.classList.remove("popup--two");
    } else if (step === 5) {
      popup.classList.add("popup--final");
      popup.classList.remove("popup--three");
    } else if (step > 5) {
      popup.classList.add("popup--disabled");
    }
  }, [step]);

  useEffect(() => {
    if (globePartialOverlay !== null) {
      globePartialOverlay.classList.add("globe-partial-overlay--disabled");
    }

    const globeWWD = globeRef.current;

    globeWWD.wwd.goToAnimator.goTo(
      new WorldWind.Location(coordinates.latitude, coordinates.longitude)
    );
  }, [coordinates]);

  return (
    <>
      {status === true ? (
        <div className="global-overlay">
          <div className="modal-wrapper">
            <div className="modal-wrapper__glass">
              <div className="modal-wrapper__container">
                <div className="modal-content">
                  {step == 0 && (
                    <>
                      <div className="modal-content__header">
                        <h2 className="modal-content__title">
                          Welcome to Water LLM!
                        </h2>
                        <p className="modal-content__description">
                          Please select your role, your choice will help us
                          customize your experience for maximum effectiveness
                          within our learning environment.
                        </p>
                      </div>
                      <div className="user-type-box">
                        <div className="user-type-box__item">
                          <h2>Student</h2>
                          <img
                            src={student}
                            className="user-type-box__item__img"
                            onClick={() => handleNextStep()}
                          />
                        </div>
                        <div className="user-type-box__item">
                          <h2>Teacher</h2>
                          <img
                            src={teacher}
                            className="user-type-box__item__img"
                            onClick={() => handleNextStep()}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {step == 1 && (
                    <>
                      <div className="modal-content__header">
                        <h2 className="modal-content__title">
                          Nice to have you!
                        </h2>
                        <p className="modal-content__description">
                          We have a ready to go tutorial for you. We'll guide
                          you through all Katara's features.
                        </p>
                      </div>

                      <div
                        className="button-wrapper"
                        onClick={() => handleNextStep()}>
                        <div className="button-wrapper__container">
                          <button className="button-container__item">
                            Follow tutorial
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
        ""
      )}
      <div className="wrapper">
        <div className="container">
          <div className="popup-component popup--disabled">
            <div className="popup-component__wrapper">
              <div className="popup-component__wrapper__container">
                {step < 5 && (
                  <div className="popup-number-wrapper">
                    <div className="popup-number-wrapper__container">
                      <h3 className="popup-number">{step - 1}</h3>
                    </div>
                  </div>
                )}
                <div className="popup-header">
                  {step === 5 && (
                    <div className="popup-icon-wrapper">
                      <div className="popup-icon-wrapper__container">
                        <img
                          src={starIcon}
                          className="popup-icon-wrapper__container__icon"
                        />
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    <>
                      <h3 className="popup-title">Explore Earth</h3>
                      <p className="popup-description">
                        Get started by clicking, dragging, and zooming to
                        explore the Katara Earth Globe!
                      </p>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <h3 className="popup-title">Ask Katara a Question</h3>
                      <p className="popup-description">
                        Click on a suggested message to get a answer and Katara
                        will instantly generate a relevant map to the question!
                      </p>
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <h3 className="popup-title">Exploring: Climate Change</h3>
                      <p className="popup-description">
                        Click on a suggested message to delve into a example the
                        impact of climate change on water resources!
                      </p>
                    </>
                  )}
                  {step === 5 && (
                    <>
                      <h3 className="popup-title">Awesome!</h3>
                      <p className="popup-description">
                        Experience Project Katara freely now!
                      </p>
                    </>
                  )}
                </div>
                <div className="popup-button-wrapper">
                  {step === 5 ? (
                    <button
                      className="popup-button-wrapper__item"
                      onClick={() => handleNextStep()}>
                      Finish tutorial 4 / 4
                    </button>
                  ) : (
                    <button
                      className="popup-button-wrapper__item"
                      onClick={() => handleNextStep()}>
                      Skip {step - 1} / 4
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="chat-component">
            {step === 2 ? <div className="partial-overlay"></div> : ""}
            <div className="chat-wrapper">
              <div className="chat-wrapper__glass">
                <div className="chat-wrapper__container">
                  <img className="logo" src={logo} />
                  <div className="chat-content">
                    {step < 6 ? (
                      <>
                        <div className="selected-questions-box">
                          <div
                            className="selected-questions-box__item"
                            onClick={() =>
                              handleSelectedQuestions(
                                1,
                                "firstPredefinedAnswer"
                              )
                            }>
                            <div className="selected-questions-box__item__wrapper">
                              <div className="selected-question-container">
                                <p className="selected-question-container__text">
                                  Show me the longest river in the world
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="selected-answers-box">
                          <p
                            className="selected-answers-box__answer"
                            id="firstPredefinedAnswer"></p>
                        </div>
                        {step > 3 && (
                          <>
                            <div className="selected-questions-box">
                              <div
                                className="selected-questions-box__item"
                                onClick={() =>
                                  handleSelectedQuestions(
                                    2,
                                    "secondPredefinedAnswer"
                                  )
                                }>
                                <div className="selected-questions-box__item__wrapper">
                                  <div className="selected-question-container">
                                    <p className="selected-question-container__text">
                                      How the climate change impact on water?
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="selected-answers-box">
                              <p
                                className="selected-answers-box__answer"
                                id="secondPredefinedAnswer"></p>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {questions.map((data) => (
                          <>
                            <div className="selected-questions-box">
                              <div
                                className="selected-questions-box__item"
                                onClick={() =>
                                  handleSelectedQuestions(
                                    1,
                                    "firstPredefinedAnswer"
                                  )
                                }>
                                <div className="selected-questions-box__item__wrapper">
                                  <div className="selected-question-container">
                                    <p className="selected-question-container__text">
                                      {data}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="selected-answers-box">
                              <p
                                className="selected-answers-box__answer"
                                id={answerId}></p>
                            </div>
                          </>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="chat-input-box">
                  <div className="chat-input-box__container">
                    <input
                      placeholder="Ask Katara..."
                      className="chat-input-box__item"
                      onChange={(e) => handleOnChange(e)}
                    />
                    <div className="chat-input-box__button">
                      <svg
                        onClick={() => handleOnSubmit()}
                        width="21"
                        height="26"
                        viewBox="0 0 21 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M17.7977 11.6005L4.6727 4.10909C4.45146 3.98499 4.1977 3.93113 3.94512 3.95468C3.69254 3.97823 3.45311 4.07806 3.25862 4.24092C3.06414 4.40379 2.9238 4.62197 2.85627 4.86648C2.78873 5.111 2.79719 5.37028 2.88051 5.60987L5.30239 12.6778C5.30208 12.6804 5.30208 12.6831 5.30239 12.6857C5.30195 12.6882 5.30195 12.6909 5.30239 12.6935L2.88051 19.7771C2.81378 19.9655 2.79324 20.1673 2.8206 20.3653C2.84796 20.5634 2.92244 20.752 3.03777 20.9153C3.15311 21.0786 3.30594 21.2119 3.48343 21.3039C3.66093 21.396 3.85792 21.4441 4.05785 21.4442C4.27478 21.4437 4.4879 21.3872 4.6766 21.2802L17.7946 13.7763C17.9881 13.6679 18.1492 13.51 18.2616 13.3187C18.3739 13.1275 18.4333 12.9098 18.4337 12.688C18.4341 12.4662 18.3754 12.2483 18.2638 12.0566C18.1522 11.865 17.9916 11.7065 17.7985 11.5974L17.7977 11.6005ZM4.05785 20.1942V20.1872L6.41254 13.3192H10.9329C11.0986 13.3192 11.2576 13.2534 11.3748 13.1362C11.492 13.019 11.5579 12.86 11.5579 12.6942C11.5579 12.5285 11.492 12.3695 11.3748 12.2523C11.2576 12.1351 11.0986 12.0692 10.9329 12.0692H6.41879L4.06254 5.20362L4.05785 5.19425L17.1829 12.681L4.05785 20.1942Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fullscreen">
            <div className="ui-actions-box">
              <div
                className="ui-actions-box__item"
                data-action-text="Download as CSV: upcoming feature.">
                <a className="ui-actions-box__item__link">
                  <img src={downloadIcon} />
                </a>
              </div>
              <div
                className="ui-actions-box__item"
                data-action-text="Charts: upcoming feature.">
                <a className="ui-actions-box__item__link">
                  <img src={chartIcon} />
                </a>
              </div>
            </div>
            {step !== 6 && (
              <div
                className="button-wrapper button-wrapper--skip-tutorial"
                onClick={() => handleNextStep("finish")}>
                <div className="button-wrapper__container">
                  <button className="button-container__item">
                    Skip tutorial
                  </button>
                </div>
              </div>
            )}

            {step === 3 ? (
              <div className="partial-overlay globe-partial-overlay"></div>
            ) : (
              ""
            )}
            <Globe
              ref={globeRef}
              layers={layers}
              latitude={coordinates.latitude}
              longitude={coordinates.longitude}
              altitude={10e6}
            />
          </div>
        </div>
      </div>
    </>
  );
}
