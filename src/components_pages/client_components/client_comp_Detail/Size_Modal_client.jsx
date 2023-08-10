import styled from 'styled-components';

const ModalBackdrop = styled.div`
  // TODO : Modal이 떴을 때의 배경을 깔아주는 CSS를 구현
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(76, 76, 76, 0.7);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalView = styled.div`
  position: relative;
  z-index: 5;
  background-color: white;
  border: 2px solid black;
  color: #121924;
  font-size: 30px;
  margin-bottom: 60px;
  text-align: center;
  /* background-color: red; */
  padding: 0px 30px;
  width: 50vw;
  padding-bottom: 50px;

  @media screen and (max-width: 1040px) {
    width: 70vw;
  }

  @media screen and (max-width: 700px) {
    width: 90vw;
  }

  @media screen and (max-width: 400px) {
    padding: 0px 20px;
    padding-bottom: 50px;
  }

  .sizing {
    position: relative;
    font-size: 14px;
    font-weight: bold;
    color: black;
    padding-top: 30px;
    /* background-color: beige; */
    margin: 0px auto;
  }

  .top_btn_box {
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: 400px) {
      font-size: 11px;
    }
    button {
      background: none;
      text-decoration: underline;
      border: none;
      font-weight: bold;
      margin-left: 70px;
    }
  }

  .size_img_wrap {
    position: relative;
    z-index: 5;
    img {
      width: 35vw;

      @media screen and (max-width: 1040px) {
        width: 50vw;
      }

      @media screen and (max-width: 700px) {
        width: 75vw;
      }
    }
  }

  .sizeBox {
    position: relative;

    .sizeList {
      list-style: none;
      padding: 0px;
      @media screen and (max-width: 400px) {
        font-size: 11px;
      }

      &:last-child {
        border-bottom: 1.5px solid gray;
      }

      li {
        padding: 5px 30px;
        border-top: 1.5px solid gray;
      }

      .sizeName {
        text-align: right;
      }
      .sizeCheck {
        display: flex;
        justify-content: space-between;

        span {
        }
      }
    }
  }
`;

export default function Size_Modal_client({ handleCloseModal }) {
  return (
    <>
      <ModalBackdrop onClick={handleCloseModal}>
        <ModalView>
          <div className="sizing">
            <div className="top_btn_box">
              <span>PRODUCT MEASUREMENTS</span>
              <button onClick={handleCloseModal}>CLOSE</button>
            </div>

            <div className="size-detail">
              <div className="size_img_wrap">
                <img src="/images/bnsize.jpg" alt="beanie size artwork" />
              </div>
            </div>

            <div className="sizeBox">
              <ul className="sizeList">
                <li className="sizeName">OS</li>
                <li className="sizeCheck">
                  <span>Depth</span>
                  <span>30cm</span>
                </li>
              </ul>
            </div>
          </div>
        </ModalView>
      </ModalBackdrop>
    </>
  );
}
