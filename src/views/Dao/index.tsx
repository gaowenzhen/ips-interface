import { useState } from "react";
import {
  FlexCCBox,
  FlexSBCBox,
  FlexSCBox,
  FlexSSBox,
} from "../../components/FlexBox";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import NoData from "../../components/Nodata";
import { Trans } from "@lingui/macro";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { ReactComponent as TipsIcons } from "../../asstes/cns/tips.svg";
import { ReactComponent as LinkIcons } from "../../asstes/cns/link.svg";

const Main = styled(FlexCCBox)`
  width: 100%;
  text-align: center;
`;

const Container = styled.div`
  padding: 20px 0;
  width: 90%;
  margin: 0 auto;
`;

const Item = styled(FlexCCBox)`
  width: 100%;
`;

const Detail = styled.div`
  width: 100%;
  border: 1px solid #b6d1d9;
  border-radius: 18px;
  padding: 40px;
  text-align: left;
  & > div {
    margin: 12px 0;
  }
  @media (max-width: 800px) {
    padding: 20px 16px;
  }
`;

const LoginModule = styled(Item)<{ isVasable: boolean }>`
  margin-top: 40px;
  display: ${({ isVasable }) => (isVasable ? "flex" : "none")};
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 400;
  font-size: 24px;
  color: #005f7d;
`;

const ViceTitle = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: #020202;
`;

const Description = styled(FlexSBCBox)`
  font-size: 16px;
  color: #1a1a1a;
  display: flex;
  flex-wrap: wrap;
`;

const TitleBox = styled(FlexSBCBox)`
  padding: 20px;
  background: #f6f6f6;
  border-radius: 8px;
`;

const ContentBox = styled.div`
  padding: 20px;
  background: #f6f6f6;
  border-radius: 8px;
`;

const Left = styled.div``;

const Right = styled(FlexCCBox)`
  border: 0.5px solid #c8c8c8;
  cursor: pointer;
`;

const SetBtnContent = styled(FlexCCBox)<{ bgcolor?: string }>`
  padding: 4px 24px;
  background: ${({ bgcolor }) => bgcolor ?? "#FFFFFF"};
  color: #005f7d;
  white-space: nowrap;
  border: 1px solid #bed6dd;
  border-radius: 9px;
  margin-left: 24px;
  cursor: pointer;
`;

const BackIcon = styled(ExitToAppIcon)`
  margin-right: 20px;
`;

const AccordionItem = styled(Accordion)`
  margin-top: 40px !important;
  background: #ffffff;
  box-shadow: 0px 4px 4px #efefef;
  border-radius: 9px;
  border: 0 none;
`;

const RegisterTypography = styled(FlexSBCBox)`
  background: #ffffff;
  border: 1px solid #b6d1d9;
  border-radius: 9px;
  padding: 8px 0px;
  text-align: left;
  font-size: 16px;
  width: 100%;
`;
const RegisterTypographyitem = styled.div`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  justify-content: space-between;
  
`;

const RegisterTypography1 = styled.div<{
	isMobile?: boolean;
  }>`
  color: #5f829c;
  font-size: 32px;
  line-height:${({ isMobile }) => (isMobile ? "48px;" : "normal")};
`;

const RegisterTypography2 = styled.div<{
	isMobile?: boolean;
  }>`
  color: #005f7d;
  line-height:${({ isMobile }) => (isMobile ? "48px;" : "normal")};
`;

const RegisterTypography3 = styled.div<{
	isMobile?: boolean;
  }>`
  color: #005f7d;
  font-size: 20px;
  line-height:${({ isMobile }) => (isMobile ? "48px;" : "normal")};
`;

const Card = styled.div`
  border-radius: 18px;
  padding: 24px;
`;

const DetailsItem = styled(FlexSBCBox)`
  width: 100%;
`;

const CradFooter = styled.div`
  width: 100%;
`;

const YearsBorder = styled.div`
  width: 100%;
  margin: 12px 0;
  border-bottom: 1px solid #b6d1d9;
`;

const CardBorder = styled.div`
  width: 100%;
  margin: 28px 0 20px;
  border-bottom: 1px solid #b6d1d9;
`;

const TypographyBtn = styled(Button)<{ bgcolor?: string }>`
  width: 150px;
  padding: 4px 40px;
  background: ${({ bgcolor }) => bgcolor ?? "#FFFFFF"} !important;
  border-radius: 6px;
  color: #49475d !important;
`;

const Years = styled(FlexSCBox)`
  width: 100%;
`;

const Icon = styled(FlexCCBox)`
  background: #dce9ed;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
`;

const YearsCheck = styled.div`
  display:flex;
  flex-wrap: wrap;
`;

const LinkCard = styled.div`
  max-height: 78px;
  padding: 0 16px;
`;

const UrlCard = styled.div`
  max-height: 78px;
  flex: 1;
`;

const YearsCheckContent = styled(FlexSBCBox)``;

const YearsCheckText = styled(FlexCCBox)`
  font-weight: 400;
  font-size: 20px;
  color: #49475d;
  padding: 0 24px;
`;

const LinkIcon = styled(FlexCCBox)``;

const TipsIconsGroup = styled(TipsIcons)`
  margin: 0 4px;
`;

const UrlContent = styled(FlexSSBox)`
  min-height: 30px;
`;

const CardInfo = styled.div`
  font-size: 14px;
  margin-top: 16px;
`;

const LinkBorder = styled.div`
  width: 100%;
  height: 8px;
  border-bottom: 1px dashed transparent;
`;

export default function Doa() {
  const [avatarUrl, setAvatarUrl] = useState("1");
  const [yearNum, setYearNum] = useState(1);
  const ismobile = useMediaQuery("(min-width:980px)");

  return (
    <Main>
      <Container>
        <LoginModule isVasable={!!avatarUrl}>
          <Detail>
            <Title>
              <Trans>Your CNS</Trans>
            </Title>
            <ViceTitle>
              <Trans>
                Your Plots are automatically staked when you claim it with $？.{" "}
              </Trans>
            </ViceTitle>
            <Description>
              <Trans>
                You will have to stake Plots to build on it if you purchased it
                on a secondary market.Unstake your？ to list it on a secondary
                market.
              </Trans>{" "}
              <SetBtnContent bgcolor="transparent">
                <BackIcon fill="#005F7D" />
                <Trans>Binding on SPACE NFT</Trans>
              </SetBtnContent>
            </Description>

            <AccordionItem>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Register (1)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <RegisterTypography>
                    <RegisterTypographyitem>
                    <RegisterTypography1 isMobile={ismobile}>fndi.ckof</RegisterTypography1>
                    <RegisterTypography2 isMobile={ismobile}>
                      Expires 2025 08.02 at 13：06 （UTC+08.00）
                    </RegisterTypography2>
                    <RegisterTypography3 isMobile={ismobile}>Not Yet Due</RegisterTypography3>
					</RegisterTypographyitem>
                  </RegisterTypography>
                  <Card>
                    <Years>
                      <YearsCheck>
                        <YearsCheckContent>
                          <Icon
                            onClick={() => {
                              if (yearNum !== 1) {
                                setYearNum(yearNum - 1);
                              }
                            }}
                          >
                            <RemoveIcon />
                          </Icon>
                          <YearsCheckText>
                            {yearNum} <Trans>year</Trans>
                          </YearsCheckText>
                          <Icon
                            onClick={() => {
                              setYearNum(yearNum + 1);
                            }}
                          >
                            <AddIcon />
                          </Icon>
                        </YearsCheckContent>
                        <YearsBorder />
                        <CardInfo>
                          <TipsIconsGroup /> Registration Period
                        </CardInfo>
                      </YearsCheck>

                      <LinkCard>
                        <LinkIcon>
                          <LinkIcons width="24px" height="24px" />
                        </LinkIcon>
                        <LinkBorder />
                        <CardInfo style={{ visibility: "hidden" }}>
                          <TipsIconsGroup /> If
                        </CardInfo>
                      </LinkCard>

                      <UrlCard>
                        <UrlContent></UrlContent>
                        <YearsBorder />
                        <CardInfo>
                          <TipsIconsGroup /> Registration Price to pay
                        </CardInfo>
                      </UrlCard>
                    </Years>

                    <CradFooter>
                      <YearsBorder />
                      <CardInfo>
                        <TipsIconsGroup /> Estimated Total( Price+?). The ?
                        price is based at ?.
                      </CardInfo>
                    </CradFooter>
                  </Card>
                </Typography>
              </AccordionDetails>
            </AccordionItem>

            <AccordionItem>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Details (1)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <Card>
                    <DetailsItem>
                      <Trans>PARENT</Trans>
                    </DetailsItem>
                    <DetailsItem>
                      <Trans>REGISTRANT</Trans>
                    </DetailsItem>
                    <DetailsItem>
                      <Trans>CONTROLLER</Trans>{" "}
                      <TypographyBtn>
                        <Trans>Transfer</Trans>
                      </TypographyBtn>
                    </DetailsItem>
                    <DetailsItem>
                      <Trans>REGISTRATION DATE</Trans>{" "}
                      <TypographyBtn>
                        <Trans>Transfer</Trans>
                      </TypographyBtn>
                    </DetailsItem>
                    <DetailsItem>
                      <Trans>EXPIRATION DAIE</Trans>{" "}
                      <TypographyBtn bgcolor="#DCE9ED">
                        <Trans>Extend</Trans>
                      </TypographyBtn>
                    </DetailsItem>
                    <CardBorder />
                    <CradFooter>
                      <DetailsItem>
                        Resolver{" "}
                        <TypographyBtn>
                          <Trans>Set</Trans>
                        </TypographyBtn>
                      </DetailsItem>
                    </CradFooter>
                  </Card>
                </Typography>
              </AccordionDetails>
            </AccordionItem>

            <AccordionItem>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Subdomains (0)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <Card>Subdomains (0)</Card>
                </Typography>
              </AccordionDetails>
            </AccordionItem>
          </Detail>
        </LoginModule>
      </Container>
    </Main>
  );
}
