export default function NoDataItem (props:any) {
    return (<div className={props?.isMobile?"ipsItemPc ipsItem":'ipsItemMobile ipsItem'}></div>)
}