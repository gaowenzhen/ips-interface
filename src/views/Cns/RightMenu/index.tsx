import { FlexSBCBox, FlexSCBox, FlexSSBox, FlexCCBox } from "../../../components/FlexBox"
import styled from "styled-components"
import { SearchContext, SearchContextData } from "../../../hooks/useSearchContext"
import { useContext } from "react"
import { IPS_CNS_KEY } from "../../../constants";


// import { ReactComponent as PositionIcons } from "../../../asstes/app/position.svg";
// import { ReactComponent as RefreshIcons } from "../../../asstes/app/refresh.svg";
// import { ReactComponent as ArrowBottomIcons } from "../../../asstes/app/arrowBottom.svg";
import { Trans } from "@lingui/macro";
import { useNavigate } from "react-router-dom";

const Right = styled.div`
	font-size: 16px;
	color: #393939;
`

const Coordinate = styled(FlexSBCBox)`
	width: 100%;
`

const ArrowGroup = styled(FlexSCBox)`
	width: 100%;
	margin-top: 20px;
	flex-direction: row-reverse;
`

const CoordinatePosition = styled(FlexSSBox)`
	font-size: 24px;
`

const NftText = styled(FlexCCBox)`
	flex: 1;
	padding: 0 20px;
`

const Refresh = styled(FlexCCBox)`
	padding: 12px;
	background: rgba(0, 95, 125, 0.11);
	border-radius: 6px;
	cursor: pointer;
`

const CoordinateNft = styled(FlexSCBox)`
	flex: 1;
	padding: 9px 16px;
	background: rgba(0, 95, 125, 0.11);
	border-radius: 6px;
	margin: 0 12px;
	cursor: pointer;
`

const ArrowItem = styled(FlexSCBox)`
	padding: 8px 20px;
	border: 1px solid #DDE9ED;
	border-radius: 6px;
	margin-left: 12px;
	cursor: pointer;
`

const ArrowText = styled(FlexCCBox)`
	color: #212820;
	font-size: 12px;
	margin-right: 12px;
`


function SpaceNFTRightMenu() {
	const navigate = useNavigate()
	const searchContextData = useContext<SearchContextData>(SearchContext)
	return (
		<Right >
			<Coordinate>
				<CoordinateNft>
					<NftText onClick={() => {
						
						if(sessionStorage)
						sessionStorage.removeItem(IPS_CNS_KEY)
						
						searchContextData?.setSearchState('')
						navigate("details", { state: '' })

					}}><Trans>Create CNS</Trans></NftText>
				</CoordinateNft>
			</Coordinate>
		</Right>
	)
}

export default SpaceNFTRightMenu