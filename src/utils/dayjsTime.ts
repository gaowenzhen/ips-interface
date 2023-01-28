import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
import { BigNumberish } from "ethers"
dayjs.extend(utc)

export function dayjsTime(date: number | string | BigNumberish, rule?: string) {
	return dayjs.unix(Number(date)).utc().format(rule || "YYYY-MM-DD HH:mm") 
}