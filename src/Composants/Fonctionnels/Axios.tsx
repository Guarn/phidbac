import axios from "axios";

let reg = /token=.*;*/g;
let test1: string = "";

if (reg.test(document.cookie)) {
    test1 = document.cookie.match(reg)![0].substring(6);
    if (test1.charAt(test1.length - 1) === ";")
        test1 = test1.slice(0, test1.length - 1);
    test1 = test1.replace("Bearer%20", "Bearer ");
}

export default axios.create({
    baseURL: "https://phidbac.fr:4000/",
    headers: { Authorization: test1 },
    responseType: "json"
});
