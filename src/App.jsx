/*
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
import { useEffect, useState } from "react";
import Globe from "worldwind-react-globe";
import student from "./assets/student.png";
import teacher from "./assets/teacher.png";
import logo from "./assets/water_llm_logo.png";
import starIcon from "./assets/icon_tutorial_start.png";
import "./App.css";

export default function App() {
  const [status, setStatus] = useState(true);
  const [step, setStep] = useState(0);
  const [coordinates, setCoordinates] = useState({
    latitude: 34.2,
    longitude: -119.2,
  });
  const popup = document.querySelector(".popup-component");

  const globePartialOverlay = document.querySelector(
    ".partial-overlay.globe-partial-overlay"
  );
  console.log(globePartialOverlay);

  const layers = ["usgs-topo", "stars"];

  const handleNextStep = (step) => {
    if (!step) {
      setStep((current) => current + 1);
    } else {
      setStep(6);
    }
  };

  const handleSelectedQuestions = (questionNumber) => {
    if (questionNumber === 1) {
      setCoordinates({ latitude: 29.533438, longitude: 31.270695 });
    }
  };

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
                        Interact with this 3D Globe model!{" "}
                      </p>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <h3 className="popup-title">Teste</h3>
                      <p className="popup-description">
                        Interact with this 3D Globe model!{" "}
                      </p>
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <h3 className="popup-title">Teste 2</h3>
                      <p className="popup-description">
                        Interact with this 3D Globe model!{" "}
                      </p>
                    </>
                  )}
                  {step === 5 && (
                    <>
                      <h3 className="popup-title">Aweasome!</h3>
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
                  <div className="selected-questions-box">
                    <div
                      className="selected-questions-box__item"
                      onClick={() => handleSelectedQuestions(1)}>
                      <div className="selected-questions-box__item__wrapper">
                        <div className="selected-question-container">
                          <p className="selected-question-container__text">
                            “Show me the longest river in the world”
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chat-input-box">
                  <input
                    placeholder="Type message..."
                    className="chat-input-box__item"
                  />
                  <svg
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
          <div className="fullscreen">
            {step !== 6 && (
              <div className="button-wrapper button-wrapper--skip-tutorial">
                <div className="button-wrapper__container">
                  <button
                    className="button-container__item"
                    onClick={() => handleNextStep("finish")}>
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
