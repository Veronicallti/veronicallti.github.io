(()=>{
const station=document.querySelector('#home-listening-station');
if(!station)return;
const oldAudio=document.querySelector('#draft-audio');if(oldAudio){oldAudio.pause();oldAudio.removeAttribute('src');oldAudio.load()}
station.hidden=false;
station.querySelector('.turntable-deck').innerHTML='<img class=restored-record src=record-deck.svg?v=pixel-1 alt=黑胶唱机>';

station.setAttribute('aria-label','近况 · 最近在玩');
const images=[
'https://thunderlotusgames.com/wp-content/uploads/2023/10/Spiritfarer_Farewell_Edition_Key_Art_1-1-576x576.jpg',
'https://thunderlotusgames.com/wp-content/uploads/2023/10/Spiritfarer-SCREENSHOTS-03-576x324.jpg',
'https://thunderlotusgames.com/wp-content/uploads/2023/10/boat_blue_sky_spiritfarer-576x576.jpg'];
station.querySelectorAll('.carousel-card').forEach((card,i)=>{
card.onclick=null;
const link=document.createElement('a');link.className=card.className;link.href='https://thunderlotusgames.com/games/spiritfarer/';link.target='_blank';link.rel='noopener noreferrer';link.innerHTML='<span class="carousel-sleeve"><img src="'+images[i%images.length]+'" alt="灵魂旅人游戏画面" loading="eager"></span><span class="sleeve-meta"><span class="sleeve-title">'+['最近在玩','海上的日常','慢慢探索'][i]+'</span><span class="sleeve-artist">Spiritfarer</span></span>';card.replaceWith(link);
});
station.querySelector('.station-player').hidden=true;
const caption=document.createElement('p');caption.className='recent-caption';caption.innerHTML='<span>近况</span><span class="recent-item"><svg class="recent-pixel-icon" viewBox="0 0 16 16" role="img" aria-label="正在玩"><path fill="currentColor" d="M3 4h10v1h1v2h1v6h-3v-2H4v2H1V7h1V5h1z"/><path fill="var(--recent-icon-cutout,#edf6fb)" d="M4 6h1v2h2v1H5v2H4V9H2V8h2zM10 7h2v2h-2zM12 9h2v2h-2z"/></svg>灵魂旅人</span><span class="recent-item"><svg class="recent-pixel-icon" viewBox="0 0 16 16" role="img" aria-label="正在读"><path fill="currentColor" d="M1 3h5v1h4V3h5v10h-5v1H6v-1H1z"/><path fill="var(--recent-icon-cutout,#edf6fb)" d="M2 4h4v1h1v7H6v-1H2zM9 5h1V4h4v7h-4v1H9z"/><path fill="currentColor" d="M3 6h3v1H3zM3 8h3v1H3zM10 6h3v1h-3zM10 8h3v1h-3z"/></svg>游戏入侵</span><span class="recent-item"><svg class="recent-pixel-icon" viewBox="0 0 16 16" role="img" aria-label="敲代码"><path fill="currentColor" d="M2 2h12v9H2zM1 12h14v2H1z"/><path fill="var(--recent-icon-cutout,#edf6fb)" d="M3 3h10v7H3z"/><path fill="currentColor" d="M5 4h1v1H5v1H4v1h1v1h1v1H5V8H4V7H3V6h1V5h1zM10 4h1v1h1v1h1v1h-1v1h-1v1h-1V8h1V7h1V6h-1V5h-1zM7 5h1v3H7z"/></svg>地球Online</span>';station.append(caption);
const panel=document.createElement('section');panel.className='ocean-ambience';panel.setAttribute('aria-label','海浪环境音');
panel.innerHTML='<span class="ocean-name music-pixels" aria-label="Music"><span aria-hidden="true">█   █ █   █ █████ █ █████<br>██ ██ █   █ █     █ █    <br>█ █ █ █   █ █████ █ █    <br>█   █ █   █     █ █ █    <br>█   █ █████ █████ █ █████</span></span><button type="button" class="ocean-toggle" aria-label="开启海浪声" aria-pressed="false">▶</button><label class="ocean-volume"><input type="range" min="0" max="100" value="35" aria-label="海浪音量"></label><span class="ocean-status" role="status" hidden></span>';
station.after(panel);
let ctx,master,playing=false,busy=false;
function init(){
ctx=new (window.AudioContext||window.webkitAudioContext)();
master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
// Independently generated noise, softly filtered and modulated into slow surf.
for(let channel=0;channel<2;channel++){
const buffer=ctx.createBuffer(1,ctx.sampleRate*13,ctx.sampleRate),data=buffer.getChannelData(0);let brown=0;
for(let i=0;i<data.length;i++){brown=(brown+.025*(Math.random()*2-1))/1.025;data[i]=brown*4}
const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;
const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=channel?1400:950;
const swell=ctx.createGain();swell.gain.value=.42;
const lfo=ctx.createOscillator();lfo.frequency.value=channel?.083:.062;const depth=ctx.createGain();depth.gain.value=.32;lfo.connect(depth).connect(swell.gain);
source.connect(filter).connect(swell);
const pan=ctx.createStereoPanner();pan.pan.value=channel?.55:-.55;swell.connect(pan).connect(master);
source.start(0,channel?4:0);lfo.start();
}
}
const button=panel.querySelector('button'),volume=panel.querySelector('input'),status=panel.querySelector('[role=status]');
function level(){return Number(volume.value)/100*.55}
button.onclick=async()=>{if(busy)return;busy=true;try{if(!ctx)init();await ctx.resume();playing=!playing;master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(playing?level():0,ctx.currentTime,.35);panel.classList.toggle('is-playing',playing);station.classList.toggle('is-playing',playing);button.textContent=playing?'Ⅱ':'▶';button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',playing?'关闭海浪声':'开启海浪声');status.textContent=playing?'海浪轻响，慢慢呼吸':'让思绪随海浪漂流'}catch{status.textContent='浏览器暂不支持环境音'}finally{busy=false}};
volume.oninput=()=>{if(ctx&&playing)master.gain.setTargetAtTime(level(),ctx.currentTime,.1)};
window.addEventListener('pagehide',()=>{if(ctx)ctx.suspend()});
})();
