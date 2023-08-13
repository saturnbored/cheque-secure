import { Carousel } from "react-bootstrap";

const ImageCarousel = (props) => {
  return (
    <>
      <Carousel interval={null} variant="dark">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={`data:image/png;base64,${props.frontImage}`}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={`data:image/png;base64,${props.backImage}`}
            alt="Second slide"
          />
        </Carousel.Item>
      </Carousel>
    </>
  );
};

export default ImageCarousel;
