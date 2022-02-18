import React from "react"
import "./Loader.css"

const Loader: React.FC = () => {
  return (
    <div className="container">
      <svg
        viewBox="0 0 80 80"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg">
        <g
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2">
          <path className="topArrow" d="M11 32v-7c0-7.732 6.268-14 14-14h7" />
          <path
            className="bottomArrow"
            d="m26 5 6 6-6 6M69 48v7c0 7.732-6.268 14-14 14h-7"
          />
          <path
            className="knot"
            d="m54 75-6-6 6-6M31.384 25.113C33.194 15.929 41.285 9 51 9c11.046 0 20 8.954 20 20 0 9.715-6.929 17.806-16.113 19.616"
          />
          <circle className="circle" cx="29" cy="51" r="20" />
          <path
            className="triangles"
            d="m29 45-10 6 10 6 10-6zM38 58l-9 8-9-8M38 44l-9-8-9 8"
          />
        </g>
      </svg>
    </div>
  )
}

export default Loader
