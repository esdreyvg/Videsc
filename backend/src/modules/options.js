

export default function downloadOptions(cookies, proxy) {

    return {
        filter: format => format.container === 'mp4',
        requestOptions: {
            headers: {
              cookie: cookies,
            },
            agent: proxy
        },
    };
}