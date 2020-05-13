import axios from 'axios';
import {dd} from './helpers';


const API_URL = 'https://vargasoff.ru:8000/';

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
}

axios.defaults.headers.common = {
    Accept: "application/json, text/plain, */*"
}

export default class API {

    constructor() {
        dd('API: ', 'init');
    }

    async send(method = 'GET', action, data = {}) {
        const response = await axios({
            method,
            url: `${API_URL}${action}`,
            data
        }).catch(error => {
            console.error('Error API:', error);
        });
        return response ? response.data : [];
    }

    async POSTGeoPosition(meet) {
        return await this.send('POST', 'GeoPosition', meet);
    }

    async GetGeoPosition(location) {
        return await this.send('GET', `GeoPosition?meet=${location.meet}`, null);
    }

    async GetGroupInfo() {
        return await this.send('GET', `GetGroupInfo`, null);
    }

    async AddMeet(meet) {

        return await this.send('POST', 'AddMeet', meet);
    }

    async IsFirst() {

        return await this.send('GET', `IsFirst`, null);
    }

    async GetMeets() {
        const meets = await this.send('GET', `GetMeets`, null);

        if (!meets.failed) {
            meets.forEach(e => {
                    const reader = new FileReader();
                    const blob = b64toBlob(e.photo.replace(`b'`, '').replace(`'`, ''), 'image/png');
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        e.photo = reader.result;
                    }
                }
            );
            return meets.reverse();
        } else return [];
    }

    async GetMeet(meetId) {
        const meet = await this.send('GET', `GetMeet?meet=${meetId}`, null);

        dd('API: ', 'GetMeet', meet.replace(`b'`, '').replace(`'`, ''));

        return meet.replace(`b'`, '').replace(`'`, '');
    }

    async GetAllMeets() {
        const allMeets = await this.send('GET', `admin/GetAllMeets`, null);
        dd('API: ', 'GetAllMeets', allMeets);

        if (!allMeets.failed) {
            allMeets.forEach(e =>
                e.photo = e.photo.replace(`b'`, '').replace(`'`, '')
            );
            return allMeets.reverse();
        } else return [];

    }

    async GetExpiredUserMeets() {
        const expireduserMeets = await this.send('GET', `GetExpiredUserMeets`, null);
        dd('API: ', 'GetExpiredUserMeets', expireduserMeets);

        if (!expireduserMeets.failed) {
            expireduserMeets.forEach(e => {
                    const reader = new FileReader();
                    const blob = b64toBlob(e.photo.replace(`b'`, '').replace(`'`, ''), 'image/png');
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        e.photo = reader.result;
                    }
                }
            );
            return expireduserMeets.reverse();
        } else return [];

    }

    async GetOwneredMeets() {
        const ownereduserMeets = await this.send('GET', `GetOwneredMeets`, null);
        dd('API: ', 'GetOwneredMeets', ownereduserMeets);

        if (!ownereduserMeets.failed) {
            ownereduserMeets.forEach(e => {
                    const reader = new FileReader();
                    const blob = b64toBlob(e.photo.replace(`b'`, '').replace(`'`, ''), 'image/png');
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        e.photo = reader.result;
                    }
                }
            );
            return ownereduserMeets.reverse();
        } else return [];

    }

    async RateComment(data) {

        return await this.send('POST', 'RateComment', data);
    }

    async GetUserMeets() {
        const userMeets = await this.send('GET', `GetUserMeets`, null);
        dd('API: ', 'GetUserMeets', userMeets);

        if (!userMeets.failed) {
            userMeets.forEach(e => {
                    const reader = new FileReader();
                    const blob = b64toBlob(e.photo.replace(`b'`, '').replace(`'`, ''), 'image/png');
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        e.photo = reader.result;
                    }
                }
            );
            return userMeets.reverse();
        } else return [];

    }

    async AddMeetMember(data) {

        return await this.send('POST', 'AddMeetMember', data);
    }

    async RemoveMeetMember(data) {

        return await this.send('POST', `RemoveMeetMember`, data);
    }

    async AddComment(data) {

        return await this.send('POST', `AddComment`, data);
    }

    async GetMeetComments(meet) {

        return await this.send('GET', `GetMeetComments?meet=${meet}`, null);

    }

    async RemoveComment(data) {

        return await this.send('POST', `RemoveComment`, data);
    }

    async Approve(data) {

        return await this.send('POST', `admin/Approve`, data);
    }

    async DeApprove(data) {

        return await this.send('POST', `admin/DeApprove`, data);
    }

    async Deny(data) {

        return await this.send('POST', `/admin/DenyMeet`, data);
    }
}
