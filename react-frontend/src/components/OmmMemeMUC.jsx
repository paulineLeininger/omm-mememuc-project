import React from 'react';

const MEME_API_BASE_URL = 'http://localhost:3001/public/assets';

    const OmmMemeMUC = () => {
    const [selectState, setSelectState] = React.useState();
    const [memeState, setMemeState] = React.useState([
        {
            name: 'doge',
            link: `${MEME_API_BASE_URL}/memes/doge.jpg`,
        },
    ])
    const [captionState, setCaptionState] = React.useState({
        topText: '', topX: 0, topY: 0,
        bottomText: '', bottomX: 0, bottomY: 0,
    })

    const getMemes = () => {
        fetch(`${MEME_API_BASE_URL}/memes`)
        .then(res => res.json())
        .then((memes) => {
        setMemeState(memes.map(meme => {
            meme.link = `${MEME_API_BASE_URL}${meme.link}`
            return meme
        }))
        })
    }
    const memeURL = () => {
        var meme = selectState;
        if (!meme) {
        return null
        }
        const url = new URL(meme.link);
        url.searchParams.append('text', captionState.topText);
        url.searchParams.append('x', captionState.topX.toString());
        url.searchParams.append('y', captionState.topY.toString());
        url.searchParams.append('text2', captionState.bottomText);
        url.searchParams.append('x2', captionState.bottomX.toString());
        url.searchParams.append('y2', captionState.bottomY.toString());
        return url
    }
    const captionChanged = (e) => {
        setCaptionState({
        ...captionState,
        [e.target.name]: e.target.value,
        })
    }
    
    React.useEffect(() => {getMemes()},[])

    let results = (<h3>No Meme Selected</h3>)
    let url = memeURL() 
                        
    if (url) { 
        results = (<img src={url.toString()} alt="selected"/>)
    }

    return (
        <div className="mememuc">
        <ul className="meme-list">
            {memeState.map((meme) => {
            return (
                <li key={meme.link} onClick={() => { setSelectState(meme) }}>
                <img src={meme.link} alt="lists" />
                </li>
            );
            })}
        </ul>
        <div className="results">
            {results}
        </div>
        <div className="params">
            <div className="texts">
            <input
                name="topText"
                value={captionState.topText}
                onChange={captionChanged}
                type="text"
                placeholder="Upper Text"
            />
            <input
                name="bottomText"
                value={captionState.bottomText}
                onChange={captionChanged}
                type="text"
                placeholder="Lower Text"
            />
            </div>
            <div className="positions">
            <input
                name="topX"
                value={captionState.topX}
                onChange={captionChanged}
                type="number"
            />
            <input
                name="topY"
                value={captionState.topY}
                onChange={captionChanged}
                type="number"
            />
            <input
                name="bottomX"
                value={captionState.bottomX}
                onChange={captionChanged}
                type="number"
            />
            <input
                name="bottomY"
                value={captionState.bottomY}
                onChange={captionChanged}
                type="number"
            />
            </div>
        </div>
        </div>
    );
};

export default OmmMemeMUC;