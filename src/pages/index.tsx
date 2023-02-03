import Head from "next/head";
import { useState, useEffect } from "react";
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(ctx: any) {
  let body: any = await fetch("https://api.lanyard.rest/v1/users/890232380265222215").then((res: any) => res.json());

  return {
      props: { body },
  };
}

export default function Home({ body }: any) {
  const [data, setData] = useState(body.data);

    const [second, addSecond] = useState(0);
    let count = 0;

    // This is a really stupid workaround but I render an unused state every second to update the rest of the data lol theres def a better way to do this but i cba
    const updateData = (newData: any) => {
        addSecond(count++);
    };
    useEffect(() => {
      updateData(data);

      setInterval(() => {
          updateData(data);
      }, 1000);

      setInterval(async () => {
          let newBody: any = await fetch("https://api.lanyard.rest/v1/users/890232380265222215").then((res: any) =>
              res.json()
          );
          if (newBody.data.spotify !== data.spotify) setData(newBody.data);
      }, 4000);
  }, []);

  if (data.spotify === null)
      return (
        <>
        <Head>
          <title>Not Listening to anything right now.</title>
          <link rel="shortcut icon" href="/faizan.png" />
          <meta name="theme-color" content="#1DB954" />
          </Head>
          <div className="w-[100vw] h-[100vh] flex items-center justify-center text-white">
             <div className="grid grid-rows-1 gap-0 divide-y divide-gray-600 hover:divide-y-0">
                <p className="text-center">Not Listening to anything right now :)  Join Discord 👇</p>
                <a className="mt-4 drop-shadow-md hover:drop-shadow-xl" href="https://discord.gg/EHthxHRUmr">
                    <img src="https://invidget.switchblade.xyz/EHthxHRUmr" width="400" height="100" />
                </a>
             </div>
                
          </div>
          
          <div className="absolute bottom-0 right-0 mb-4 mr-4 text-white text-sm font-karla">
                <p><a className="hoverM" href="https://github.com/hellofaizan/m">Made by Faizan</a> | Inspired  by <a className="hoverS" href="https://github.com/cnrad/s" target="_blank" rel="noreferrer">cnrad.dev</a>
                </p>
            </div>
        </>
      );

  function fromMS(ms: number) {
      const totalSeconds = ms / 1000;
      const minutes = (~~(totalSeconds / 60)).toString();
      const seconds = (~~(totalSeconds % 60)).toString();
      return minutes + ":" + seconds.padStart(2, "0");
  }
  return (
    <>
      <Head>
                <title>
                    Listening to: {data.spotify.song} by {data.spotify.artist}{" "}
                </title>
                <link rel="shortcut icon" href="/faizan.png" />
                <meta name="theme-color" content="#1DB954" />

                <meta name="og:title" content={`msop.vercel.app`} />
                <meta
                    name="og:description"
                    content={`HelloFaizan is currently listening to ${
                        data.spotify.song ? data.spotify.song + " by " + data.spotify.artist : "nothing"
                    }`}
                />
                <meta name="og:image" content={data.spotify.album_art_url} />
            </Head>
            <div className="absolute w-[100vw] h-[100vh] overflow-hidden opacity-80 z-[10] flex items-center justify-center">
                <img
                    className="w-[100vw] blur-2xl z-[10]"
                    src={data.spotify.album_art_url}
                    alt="Album art but blurred"
                />
            </div>

            <div className="absolute w-[100vw] h-[100vh] flex items-center justify-center text-white z-[20]">
                <div className="p-8 w-[33rem] bg-[#000] bg-opacity-60 rounded-lg flex flex-col items-center justify-start font-karla">
                    <div className="w-full flex flex-row items-center justify-start mb-6">
                        <img
                            src={data.spotify.album_art_url}
                            className="w-[8rem] h-[8rem] rounded-md"
                            alt="Album Art"
                        />
                        <div className="ml-6 flex flex-col items-start justify-center">
                            <a
                                href={`https://open.spotify.com/track/${data.spotify.track_id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xl text-white font-semibold"
                            >
                                {data.spotify.song}
                            </a>
                            <h2 className="text-lg text-gray-300 font-normal">{data.spotify.artist}</h2>
                            <h3 className="text-lg text-gray-300 font-normal italic">in {data.spotify.album}</h3>
                        </div>
                    </div>
                    <div className="w-full h-[0.35rem] rounded-full bg-gray-700 mb-1">
                        <div
                            className="bg-gray-300 h-[0.35rem] rounded-full"
                            style={{
                                width: `${(
                                    ((new Date().getTime() - data.spotify.timestamps.start) /
                                        (data.spotify.timestamps.end - data.spotify.timestamps.start)) *
                                    100
                                ).toString()}%`,
                            }}
                        />
                    </div>
                    <div className="w-full h-auto flex flex-row items-center justify-between text-base text-gray-400">
                        <p>{fromMS(new Date().getTime() - data.spotify.timestamps.start)}</p>
                        <p>{fromMS(data.spotify.timestamps.end - data.spotify.timestamps.start)}</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 mb-4 mr-4 text-white text-sm font-karla">
                <p>Made by Faizan | Inspired  by cnrad.dev</p>
            </div>

    </>
  )
}
