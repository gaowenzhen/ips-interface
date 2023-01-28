import { FlexSBCBox, FlexSCBox, FlexSSBox, FlexCCBox } from "../../../../../components/FlexBox"
import styled from "styled-components"

import { ReactComponent as ArrowLeftIcons } from "../../../../../asstes/spaceNFT/arrowLeft.svg";
import { Trans } from "@lingui/macro";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Right = styled.div`
	font-size: 16px;
	color: #393939;
`

const Coordinate = styled(FlexSBCBox)`
	width: 100%;
`

const NftText = styled(FlexCCBox)`
	flex: 1;
	margin-left: 20px;
`

const CoordinateNft = styled(FlexSCBox)`
	flex: 1;
	padding: 8px 24px;
	background: rgba(0, 95, 125, 0.11);
	border-radius: 6px;
	margin: 0 12px;
	cursor: pointer;
`

function SpaceNFTDetailRightMenu() {
	const navigate = useNavigate()
	const state = useLocation()

	return (
		<Right onClick={() => {
			navigate(-1)
		}}>
			<Coordinate>
				<CoordinateNft>
					<ArrowLeftIcons />
					<NftText><Trans>Go To Back</Trans></NftText>
				</CoordinateNft>
			</Coordinate>
		</Right>
	)
}

export default SpaceNFTDetailRightMenu