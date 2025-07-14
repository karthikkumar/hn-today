/** @jsxImportSource @emotion/react */
import { useStateContext } from "../state";
import { RadioGroup } from "@headlessui/react";
import { Color, Font } from "../utils/css-vars";

const Option = ({ checked, valueLabel }) => (
  <div
    css={{
      position: "relative",
      color: Color.yellow,
      fontFamily: Font.logo,
      fontSize: "1rem",
      textAlign: "center",
      width: "20px",
      margin: "0.3rem 0",
      borderBottom: `3px solid ${checked ? Color.orange : Color.transparent}`,
      cursor: "pointer",
      ":hover": {
        borderBottom: `3px solid ${Color.orange}`,
      },
    }}
  >
    {checked && (
      <span
        css={{
          position: "absolute",
          left: "-40px",
          "@media (max-width: 900px)": {
            display: "none",
          },
        }}
      >
        TOP
      </span>
    )}
    {valueLabel}
  </div>
);

function Filter() {
  const { top, setTop } = useStateContext();
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.6rem",
        padding: "1rem 2rem",

        "@media (max-width: 900px)": {
          flexDirection: "row",
          alignItems: "flex-start",
          padding: "0.5rem 1.5rem 1rem 1.5rem",
        },

        "@media (max-width: 500px)": {
          padding: "0.3rem 1.5rem 1rem 1rem",
        },
      }}
    >
      <RadioGroup
        value={top}
        onChange={setTop}
        css={{
          "@media (max-width: 900px)": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.8rem",
          },
        }}
      >
        <div
          css={{
            position: "relative",
            color: Color.yellow,
            fontFamily: Font.logo,
            fontSize: "1rem",
            margin: "0.3rem 0",
            borderBottom: `3px solid ${Color.transparent}`,

            "@media (min-width: 901px)": {
              display: "none",
            },
          }}
        >
          HOT
        </div>
        <RadioGroup.Option value="5">
          {({ checked }) => <Option checked={checked} valueLabel="05" />}
        </RadioGroup.Option>
        <RadioGroup.Option value="10">
          {({ checked }) => <Option checked={checked} valueLabel="10" />}
        </RadioGroup.Option>
        <RadioGroup.Option value="20">
          {({ checked }) => <Option checked={checked} valueLabel="20" />}
        </RadioGroup.Option>
        <RadioGroup.Option value="30">
          {({ checked }) => <Option checked={checked} valueLabel="30" />}
        </RadioGroup.Option>
      </RadioGroup>
    </div>
  );
}

export default Filter;
