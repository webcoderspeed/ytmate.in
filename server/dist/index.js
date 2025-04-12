"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ytdl_core_1 = __importDefault(require("@distube/ytdl-core"));
const googleapis_1 = require("googleapis");
const content_disposition_1 = __importDefault(require("content-disposition"));
const dotenv_1 = __importDefault(require("dotenv"));
const sendMail_1 = require("./sendMail");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const youtube = googleapis_1.google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_KEY,
});
function searchYouTube() {
    return __awaiter(this, arguments, void 0, function* (params = {}) {
        const res = yield youtube.search.list(Object.assign({ 
            // @ts-ignore
            part: 'snippet', type: 'video' }, params));
        return res.data;
    });
}
app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/contact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, issueType, description } = req.body;
        if (!email || !issueType || !description) {
            res.status(400).json({ message: 'All fields are required.' });
        }
        const mailOptions = {
            from: `"YouTubdle.com" ${process.env.MAIL_USER}`,
            to: process.env.MAIL_TO,
            subject: "YouTubdle.com Form",
            replyTo: email,
            text: `Nachricht von: ${email}\n\n${description}`,
        };
        const result = yield (0, sendMail_1.sendMail)(mailOptions);
        if (result.success) {
            res.json({ success: true, message: 'Deine Nachricht wurde erfolgreich gesendet.' });
        }
        else {
            res.status(500).json({ success: false, message: 'Fehler beim Senden deiner Nachricht.' });
        }
    }
    catch (error) {
        console.error('Error while sending the email:', error);
        res.status(500).send('Some error occurred while sending the email.');
    }
}));
app.get('/formats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoURL = req.query.url;
        const formats = yield ytdl_core_1.default.getInfo(videoURL);
        res.status(200).json(formats.formats);
    }
    catch (error) {
        console.error('Error while getting the formats:', error);
        res.status(500).send('Some error occurred while getting the formats.');
    }
}));
/**
 * Get suggestions depending on the search query/value.
 */
app.get('/suggestions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, next = null } = req.query;
    try {
        const data = yield searchYouTube({
            q: search,
            // nextPageToken: next,
            pageToken: next,
            maxResults: 14,
        });
        // @ts-ignore
        const { items, nextPageToken, pageInfo, regionCode, prevPageToken } = data;
        res.status(200).json({
            success: true,
            data: items,
            pagingInfo: Object.assign(Object.assign({}, pageInfo), { nextPageToken, regionCode, prevPageToken }),
        });
    }
    catch (error) {
        console.error(error);
        if (error.status === 403) {
            res.status(403).json({ success: false, error, limitExceeded: true });
        }
        res.status(400).json({ success: false, error, limitExceeded: true });
    }
}));
/**
 * Get information about a video.
 */
app.get('/metainfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.query.url;
    if (!ytdl_core_1.default.validateID(url) && !ytdl_core_1.default.validateURL(url)) {
        res.status(400).json({ success: false, error: 'No valid YouTube Id!' });
    }
    try {
        const result = yield ytdl_core_1.default.getInfo(url);
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error });
    }
}));
/**
 * Download a video with the selected format.
 */
app.get('/watch', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { v: url, format: f = '.mp4' } = req.query;
    if (url === undefined || (!ytdl_core_1.default.validateID(url) && !ytdl_core_1.default.validateURL(url))) {
        res.status(400).json({ success: false, error: 'No valid YouTube Id!' });
    }
    const formats = ['.mp4', '.mp3', '.mov', '.flv'];
    let format = formats.includes(f) ? f : '.mp4';
    try {
        const result = yield ytdl_core_1.default.getBasicInfo(url);
        const { videoDetails: { title }, } = result;
        res.setHeader('Content-Disposition', (0, content_disposition_1.default)(`${title}${format}`));
        let filterQuality = format === '.mp3' ? 'audioonly' : 'audioandvideo';
        (0, ytdl_core_1.default)(url, { filter: filterQuality })
            .pipe(res);
    }
    catch (err) {
        console.error('error', err);
        res.redirect(`http://${req.headers.host}?error=downloadError`);
    }
}));
