import React from 'react';
import {useNavigate} from "react-router";

const UserProfile = () => {
    const navigate = useNavigate();
    return (
        <div className='h-screen  relative w-full bg-[url("/img.png")] bg-no-repeat bg-cover'>

            <p className={"ms-10 pt-5 text-white text-8xl"}>FasalBazar</p>
            <p className={"text-lg text-white ms-10 pt-5"}>A online platform for buy crops direct from farmer </p>

          <div className={"flex absolute bottom-1/4 left-2/4    -translate-x-1/2 -translate-y-1/2 "}>
              <button onClick={()=>{
                  navigate("/crops")
              }} className={"border  rounded-lg p-1 px-5 border-amber-400 my-3  bg-amber-400 ms-10 mt-5"}>
                  Explore Products
              </button>
          </div>

        </div>
    );
};

export default UserProfile;