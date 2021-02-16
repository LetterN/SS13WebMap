/**
 * @file
 * @copyright 2021 LetterN
 * @license MIT
 */

export const Icon = props => {
  const { url } = props;
  return (
    <img src={url} style={{
      width: "32px",
      height: "32px",
    }} />
  );
};
