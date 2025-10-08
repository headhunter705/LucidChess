import "./Loading.scss";

import star_full from "../../../assets/img/star.png";
import star_none from "../../../assets/img/star_none.png";
import { useEffect, useRef, useState } from "react";
import Refund from "../Refund/Refund";

const starArray = [1, 2, 3, 4, 5];

export const Loading = ({ title, onClickRefund, roomName }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [refund, setRefund] = useState(false);
  const timeInterval = useRef(0);

  useEffect(() => {
    timeInterval.current = setInterval(() => {
      setCurrentTime((prev) => prev + 1);
      
      if (currentTime > Math.floor(Math.random() % 6) + 2) {
        if(roomName != "Classic Room") {
          
          setTimeout(() => {
            // setCurrentTime(0);
            setRefund(true);
          }, 2000);
          
        }
        
      }
    }, 500);

    return () => clearInterval(timeInterval.current);
  });

  return (
    <div className="loading">
      <div className="loading__container">
        <div className="loading__stars">
          {starArray.map((item, idx) => (
            <img
              key={`star_${idx}`}
              className="star"
              src={
                currentTime % (starArray.length + 1) > idx
                  ? star_full
                  : star_none
              }
              alt="pic"
            />
          ))}
        </div>
        <div className="loading__title">
          <p>{title}</p>
        </div>
      </div>
      <Refund
        show={refund}
        msg={"Can't load a room!"}
        hideAction={() => setRefund(false)}
        onClickRefund={onClickRefund}
      ></Refund>
    </div>
  );
};
export default Loading;
