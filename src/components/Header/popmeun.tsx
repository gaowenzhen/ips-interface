import { locales } from "../../locales";
import { t } from "@lingui/macro"
import { LOCAL_KEY } from "../../constants";
// 头部小狐狸点开菜单
export const PopItems = (account?:any,userBalance?:string) =>{

  let ManageMetars = t`Manage Meta`
  let ManageSpaceNFTrs = t`Manage IPS NFT`
  let ManageCNSrs = t`Manage CNS`
  let Disconnectrs = t`Disconnect`
  let popitem = ""
    let ConnectUi = "";
    if (account) {
      
      let react = account?.slice(0, 4) + "..." + account?.slice(account.length - 4);
      ConnectUi =
        "<span>Ethereum Balance (" +
        react +
        ")</span><div class='bracock'>" +
        userBalance +
        "</div>";
        popitem = '<div class=" gtnSef"><div class=" dMGGHo"><div style="width: 100%;">' +
        ConnectUi +
        '</div></div><div  class="dWITPl fFAsnw"></div><div class="gKPpmm"></div><div class="dWITPl fFAsnw"><div class="iLDdPW"><a href="/spaceNFT/manage" class="kyOKjv"><div class=" bDSASX"><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.9063 6.09375C13.75 6.09375 9.375 10.1562 8.90625 15.1562H10C15.1563 15.1562 19.5312 11.25 20.1562 6.25C19.6875 6.25 19.375 6.09375 18.9063 6.09375ZM15.4687 10.9375C14.8437 10.9375 14.375 10.4688 14.375 9.84375C14.375 9.21875 14.8437 8.75 15.4687 8.75C16.0937 8.75 16.5625 9.21875 16.5625 9.84375C16.5625 10.4688 16.0937 10.9375 15.4687 10.9375ZM18.5938 9.6875C16.5625 8.90625 16.4063 7.03125 16.4063 6.875H16.875C16.875 6.875 17.1875 8.75 18.9063 9.375L18.5938 9.6875Z" fill="#1C1B41"/><path d="M9.93043 10.4313C9.70945 10.1842 9.30118 10.1227 8.79542 10.2605C8.28967 10.3983 7.72787 10.7239 7.2336 11.1659C6.73933 11.6079 6.35309 12.1299 6.15985 12.6171C5.96661 13.1044 5.98219 13.517 6.20317 13.7641C6.42414 14.0112 6.83242 14.0727 7.33817 13.9349C7.84392 13.7972 8.40573 13.4715 8.9 13.0295C9.39426 12.5876 9.7805 12.0655 9.97374 11.5783C10.167 11.091 10.1514 10.6784 9.93043 10.4313Z" fill="#1C1B41"/><path d="M14.3696 14.8473C14.1486 14.6002 13.7404 14.5388 13.2346 14.6766C12.7289 14.8144 12.1671 15.1401 11.6729 15.5821C11.1786 16.0241 10.7925 16.5461 10.5992 17.0334C10.406 17.5207 10.4217 17.9333 10.6427 18.1804C10.8637 18.4275 11.2719 18.4889 11.7777 18.3511C12.2834 18.2133 12.8452 17.8876 13.3394 17.4456C13.8337 17.0036 14.2199 16.4815 14.4131 15.9942C14.6063 15.507 14.5906 15.0944 14.3696 14.8473Z" fill="#1C1B41"/><path d="M5.00049 18.7498C5.15674 18.906 6.40674 18.5935 7.34424 17.656C8.43799 16.7185 8.75049 16.0935 8.43799 15.781C8.28174 15.4685 7.50049 15.6248 6.40674 16.5623C5.46924 17.4998 4.84424 18.5935 5.00049 18.7498Z" fill="#1C1B41"/></svg></div><p class=" kkEiBN dWJSzf">'+ManageSpaceNFTrs+'</p></a><a href="/meta/manage" style="text-decoration: none;"><span class=" kyOKjv"><div class=" bDSASX"><svg width="18" height="18" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.71894 1.45738C9.68177 2.42038 10.2227 3.72639 10.2227 5.08816C10.2227 6.44993 9.68177 7.75594 8.71894 8.71893L6.03106 11.442C5.408 12.0338 4.53454 11.7482 4.22839 11.442L1.45738 8.71893C0.514922 7.75178 -0.00862676 6.4523 0.000107555 5.10191C0.00884187 3.75153 0.549156 2.45893 1.50404 1.50404C2.45893 0.549156 3.75153 0.00884187 5.10191 0.000107555C6.4523 -0.00862676 7.75178 0.514922 8.71894 1.45738ZM5.08816 2.8062C4.48295 2.8062 3.90252 3.04662 3.47457 3.47457C3.04662 3.90252 2.8062 4.48295 2.8062 5.08816C2.8062 5.69337 3.04662 6.27379 3.47457 6.70174C3.90252 7.12969 4.48295 7.37011 5.08816 7.37011C5.69337 7.37011 6.27379 7.12969 6.70174 6.70174C7.12969 6.27379 7.37011 5.69337 7.37011 5.08816C7.37011 4.48295 7.12969 3.90252 6.70174 3.47457C6.27379 3.04662 5.69337 2.8062 5.08816 2.8062Z" fill="#1C1B41"/></svg></div><p class=" kkEiBN dWJSzf">'+ManageMetars+'</p></span></a><a href="/cns/manage" style="text-decoration: none;"><span class=" kyOKjv"><div class=" bDSASX"><img src="/static/images/Groupqri.png"/></div><p class="kkEiBN dWJSzf">'+ManageCNSrs+'</p></span></a><a rel="noopener" id="Disconnectrs" class="kyOKjv"><div class=" bDSASX"><img src="/static/images/onof.png"/></div><p  class=" kkEiBN dWJSzf">'+Disconnectrs+'</p></a></div></div></div>'

    } else {

      ConnectUi =
        '<button id="WalletBtn" class="iokAZm clmjMA" style="height: 53px;">Connect Wallet</button>';

        popitem = '<div class=" gtnSef"><div class=" dMGGHo"><div style="width: 100%;">' +
    ConnectUi +
    '</div></div>'
    }
    
    return popitem
}

export const langMenu = () => {
 
  const locale = window.localStorage.getItem(LOCAL_KEY) as string;

    let lanmenu = "";
    if (locales) {
      for (let u in locales) {
        let item = locales[u];
        let selcss = ''
        if (item.flag === locale) {
          selcss = ' sellenbg'
        }

        lanmenu =
          lanmenu +
          '<div rel="' +
          u +
          '" class="lanmun'+selcss+'">' +
          item.text +
          "</div>";
      }
    }
    return lanmenu
}