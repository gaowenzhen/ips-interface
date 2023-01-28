import { Fragment, useState } from 'react'

import copy from "copy-to-clipboard"
import { t, Trans } from '@lingui/macro'
import styled, { CSSProperties } from 'styled-components'

import { Tooltip } from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { FlexCCBox } from '../FlexBox';
import useIpsTips from '../../hooks/useIpsTips';

export const CopyIcon = styled(ContentCopyIcon)`
	margin: 0 16px;
	color: #7B7CB2;
	opacity: .8;
	cursor: pointer;
	font-size: 18px!important;
`

const CopyCard = styled(FlexCCBox)`
	color: #FFFFFF;
	font-weight: 700;
	font-size: 24px;
`

const CopyText = styled.div`
	text-align: center;
`

export default function index({ text, textStyle }: { text: string, textStyle?: CSSProperties }) {
	const [isCopy, setIsCopy] = useState(false)
	const ipsTips = useIpsTips()
	text = text || "---"
	return (
		<CopyCard className='cnstitlebox' style={textStyle}>
			{
				isCopy ?
					<Trans>Copied</Trans> :
					<Fragment>{
						!!text ?
						<Fragment>
								<CopyText style={textStyle } >{text}</CopyText>
								{text !== "---" && <Tooltip title={<Trans>Copy</Trans>}>
									<CopyIcon onClick={() => {
										setIsCopy(true)
										if (copy(text)) {
											ipsTips(`Copied ${text}`, { variant: "success" })
											setInterval(() => {
												setIsCopy(false)
											}, 1000)
										}
									}} />
								</Tooltip>}
							</Fragment>
							: <Fragment />
							}
					</Fragment>
			}</CopyCard>
	)
}
