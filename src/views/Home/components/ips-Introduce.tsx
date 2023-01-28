import { useEffect, useState } from "react";


export default function IPSIntroduce() {
  useEffect(() => {

    return () => {
      console.dir(111);
    };
  }, []);

  return (
    <div className="IPSIntroduce">
     <h1>IPS Introduce</h1>
     <div className="ipsconetbox"></div>
    </div>
  );
}
