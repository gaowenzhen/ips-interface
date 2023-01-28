import { FlexSACBox, FlexSBCBox, FlexSCBox } from "../../../components/FlexBox";
import styled from "styled-components";

import { ReactComponent as PositionIcons } from "../../../asstes/spaceNFT/position.svg";
import { ReactComponent as OffersIcons } from "../../../asstes/spaceNFT/offers.svg";
import { ReactComponent as VisitorsIcons } from "../../../asstes/spaceNFT/visitors.svg";
import { ReactComponent as SubdominsIcons } from "../../../asstes/spaceNFT/subdomins.svg";
import { ReactComponent as BuyIcons } from "../../../asstes/spaceNFT/buy.svg";
import { ReactComponent as IconsIcons } from "../../../asstes/spaceNFT/icons.svg";
import { useNavigate } from "react-router-dom";

import { ReactComponent as ArrowDetailsIcons } from "../../../asstes/spaceNFT/arrowDetails.svg";
import { Trans } from "@lingui/macro";
import { useLocation } from "react-router-dom";
import { useCallback, useLayoutEffect, useState } from "react";
import { IPSNFTType } from "../../../hooks/useIPSNft";
import {
  useIPSBaseCoordinateBindContract,
  useIPSCNSRegisterarControllerContract,
  useIPSCoordinateSystemContract,
} from "../../../hooks/useContract";
import { IPSNftAddress, ZERO_ADDRESS } from "../../../constants";
import { dayjsTime } from "../../../utils/dayjsTime";
import { BigNumber } from "ethers";
import useMediaQuery from "@mui/material/useMediaQuery";

const Main = styled(FlexSBCBox)<{ isMobile?: boolean }>`
  width: 100%;
  height: 100%;
  padding: ${({ isMobile }) => (isMobile ? "40px 70px;" : "40px 30px;")};
  display:flex;
  flex-wrap: ${({ isMobile }) => (isMobile ? "initial" : "wrap;")};
`;

const Left = styled.div<{ isMobile?: boolean }>`
  width: ${({ isMobile }) => (isMobile ? "640px;" : "340px;")};
  height: ${({ isMobile }) => (isMobile ? "640px;" : "340px;")};
  background: #49475d;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
  border-radius: 18px;
  cursor: pointer;
`;

const Right = styled.div<{ isMobile?: boolean }>`
  width: 640px;${({ isMobile }) => (isMobile ? "640px;" : "100%")};
  height: 640px;
  margin-left: ${({ isMobile }) => (isMobile ? "40px;" : "0px;")};
  margin-top: ${({ isMobile }) => (isMobile ? "0px;" : "40px;")};
`;

const Coord = styled(FlexSCBox)`
  padding: 16px 28px;
  background: #eff5f7;
  border-radius: 6px;
`;

const CoordDetails = styled.div`
  padding-left: 40px;
`;

const CoordText = styled.div`
  font-weight: 400;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.58);
`;

const CoordPosition = styled.div<{ isMobile?: boolean }>`
  font-weight: 400;
  font-size: ${({ isMobile }) => (isMobile ? "36px;" : "26px;")};
  color: #000000;
`;

const RightDetail = styled.div`
  width: 100%;
  margin: 40px 0;
`;

const RightDetailItem = styled(FlexSBCBox)`
  margin-top: 20px;
  padding: 28px;
  background: #fffeff;
  box-shadow: 0px 4px 4px #efefef;
  border-radius: 6px;
  cursor: pointer;
`;

const RightDetailIcons = styled(FlexSCBox)`
  border-radius: 6px;
`;

const RightDetailText = styled(FlexSCBox)`
  margin-left: 40px;
  font-weight: 700;
  font-size: 14px;
  color: #000000;
`;

const ViewOn = styled(FlexSBCBox)`
  padding: 28px;
  background: #dce9ed;
  border-radius: 6px;
`;

const ViewOnText = styled(FlexSBCBox)`
  font-weight: 400;
  font-size: 16px;
  color: #000000;
`;

const Buy = styled(BuyIcons)`
  cursor: pointer;
`;

const Icons = styled(IconsIcons)`
  cursor: pointer;
  margin-left: 20px;
`;

const ViewOnIcons = styled.div``;

function SpaceNFTDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ipsCns = useIPSCNSRegisterarControllerContract();
  const ipsBaseCoordinateBindContract = useIPSBaseCoordinateBindContract();
  const [nftData, setNftData] = useState<IPSNFTType | null>(null);

  const ipsCoordinateSystem = useIPSCoordinateSystemContract();
  const getNftInfo = useCallback(async () => {
    if (
      ipsCns &&
      ipsCoordinateSystem &&
      ipsBaseCoordinateBindContract &&
      state
    ) {
      const tokenid = BigNumber.from((state as IPSNFTType).tokenId).toString();
      
      const cnsCoord = await ipsCoordinateSystem.getCoordinate(
        IPSNftAddress,
        tokenid
      );

      const cnsName = await ipsBaseCoordinateBindContract.getTokenCNS(
        IPSNftAddress,
        tokenid
      );

      const cnsTerm: string = await ipsCns.nameExpires(cnsName);
      const { x, y, z, metaverse } = cnsCoord;
      let coord: string[] = [];
      if (metaverse !== ZERO_ADDRESS) {
        coord = [x.toString(), y.toString(), z.toString()];
      }
      setNftData({
        ...(state as IPSNFTType),
        cnsName,
        cnsTerm,
        coord,
        isCoord: coord.length > 0 ? true : false,
      });
    }
  }, [ipsCns, ipsBaseCoordinateBindContract, state]);

  useLayoutEffect(() => {
    if (state) {
      getNftInfo();
    }
  }, [state]);
  const ismobile = useMediaQuery("(min-width:980px)");

  return (
    <Main isMobile={ismobile}>
      <Left isMobile={ismobile}></Left>
      <Right isMobile={ismobile}>
        <Coord>
          <PositionIcons />
          {!!nftData?.coord?.length ? (
            <CoordDetails>
              <CoordText>COORD</CoordText>
              <CoordPosition>[{nftData?.coord.join(", ")}]</CoordPosition>
            </CoordDetails>
          ) : (
            <CoordDetails
              onClick={() => {
                if (nftData?.bindAddress) {
                  navigate("/coord/create", {
                    state: {
                      tokenId: BigNumber.from(nftData.tokenId).toString(),
                      bindAddress: IPSNftAddress,
                    },
                  });
                }
              }}
            >
              <CoordText>COORD</CoordText>
              <CoordPosition>
                <Trans>Unbound Coord</Trans>
              </CoordPosition>
            </CoordDetails>
          )}
        </Coord>

        <RightDetail>
          <RightDetailItem>
            {nftData?.isCoord ? (
              <RightDetailIcons
                onClick={() => {
                  if (!nftData?.cnsName) {
                    navigate("/cns/bind", {
                      state: {
                        tokenId: BigNumber.from(nftData?.tokenId).toString(),
                        bindAddress: IPSNftAddress,
                      },
                    });
                  }
                }}
              >
                <OffersIcons />
                <RightDetailText>
                  {nftData?.cnsName || <Trans>Unbound CNS name</Trans>}
                </RightDetailText>
              </RightDetailIcons>
            ) : (
              <RightDetailIcons
                onClick={() => {
                  if (nftData?.isCoord) {
                    navigate("/cns/bind", {
                      state: {
                        tokenId: BigNumber.from(nftData?.tokenId).toString(),
                        bindAddress: IPSNftAddress,
                      },
                    });
                  }
                }}
              >
                <OffersIcons />
                <RightDetailText>
                  {nftData?.cnsName || <Trans>Unbound CNS name</Trans>}
                </RightDetailText>
              </RightDetailIcons>
            )}
          </RightDetailItem>

          {nftData?.cnsName ? (
            <RightDetailItem>
              <RightDetailIcons>
                <VisitorsIcons />
                <RightDetailText>
                  <Trans>{dayjsTime(nftData?.cnsTerm || "0")}</Trans>
                </RightDetailText>
              </RightDetailIcons>
              {/* <ArrowDetailsIcons /> */}
            </RightDetailItem>
          ) : null}

          <RightDetailItem>
            <RightDetailIcons>
              <SubdominsIcons />
              <RightDetailText>
                {nftData?.isBinded || nftData?.isCreated ? (
                  nftData?.isCreated ? (
                    <Trans>META</Trans>
                  ) : (
                    <Trans>NFT</Trans>
                  )
                ) : (
                  <Trans>Unbound</Trans>
                )}
              </RightDetailText>
            </RightDetailIcons>
            {/* <ArrowDetailsIcons /> */}
          </RightDetailItem>
        </RightDetail>

        <ViewOn>
          <ViewOnText>
            <Trans>VIEW ON :</Trans>
          </ViewOnText>
          <ViewOnIcons>
            <Buy />
            <Icons />
          </ViewOnIcons>
        </ViewOn>
      </Right>
    </Main>
  );
}

export default SpaceNFTDetail;
