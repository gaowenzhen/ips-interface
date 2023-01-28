import { Trans } from "@lingui/macro"
import styled from "styled-components"
import { FlexCCBox } from "../FlexBox"

const Container = styled.div`
	width: 100%;
	padding: 40px 20px;
`

const Text = styled(FlexCCBox)`
	margin-top: 20px;
`

export default function NoData() {
	return (
		<Container>
			<Text><Trans>No Data</Trans></Text>
		</Container>
	)
}
