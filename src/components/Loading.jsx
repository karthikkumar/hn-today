/** @jsxImportSource @emotion/react */

import { Color, Font } from "../utils/css-vars";

const Loading = ({ style }) => {
  return (
    <div
      css={{
        color: Color.yellow,
        fontFamily: Font.news,
        fontSize: "0.9rem",
        textAlign: "start",
        padding: "0 1rem",
        display: "flex",
        justifyContent: "space-around",
        ...style,
      }}
    >
      <span
        css={{
          height: "1px",
          width: "100%",
          backgroundColor: Color.yellowLite,
          margin: "0.6rem",
        }}
      ></span>
      <p css={{ flexShrink: 0 }}>{`Loading . . .`}</p>
    </div>
  );
};

export default Loading;
