// ---------------- GLOBAL STATE & AUTH ----------------
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const facebookLoginBtn = document.getElementById("facebookLoginBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const authScreen = document.getElementById("auth-screen");
const appWrapper = document.getElementById("app-wrapper");

// Facebook Modal elements
const facebookModal = document.getElementById("facebookModal");
const closeFacebookModal = document.getElementById("closeFacebookModal");
const facebookLoginForm = document.getElementById("facebookLoginForm");
const fbUsernameInput = document.getElementById("fbUsernameInput");

const defaultUserImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&q=80";

let currentUserName = "My User"; 
let isPremium = false; 
let userType = 'listener'; 
let screenHistory = ['home']; 
let uploadedSongs = []; 
let uploadedVideos = []; 

// *** TRACKS ARRAY: 4 Unique 1-Minute Songs ***
let tracks = [
    { 
        title: "Street Beat (60 Sec)", 
        artist: "Instrumentals Inc.", 
        duration: 60, 
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80", 
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        type: "song" 
    },
    { 
        title: "Sunset Drive", 
        artist: "Pop Collective", 
        duration: 60, 
        cover: "https://images.unsplash.com/photo-1514216825027-e17088e895c2?w=500&q=80", 
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        type: "song" 
    },
    { 
        title: "Electric Youth", 
        artist: "The Vultures", 
        duration: 60, 
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ce96?w=500&q=80", 
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        type: "song" 
    },
    { 
        title: "Future Pulse", 
        artist: "Neo-Synth", 
        duration: 60, 
        cover: "https://images.unsplash.com/photo-1534723867664-96409b3d0a6c?w=500&q=80", 
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        type: "song" 
    },
];

let podcasts = [];

// --- AUTH SCREEN LOGIC ---
loginBtn.addEventListener("click", () => { 
  signupForm.classList.add("hidden"); 
  loginForm.classList.toggle("hidden"); 
});

signupBtn.addEventListener("click", () => { 
  loginForm.classList.add("hidden"); 
  signupForm.classList.toggle("hidden"); 
});

loginForm.addEventListener("submit", e => { 
  e.preventDefault(); 
  startApp(); 
});

signupForm.addEventListener("submit", e => { 
    e.preventDefault(); 
    const usernameInput = document.getElementById("signupUsername");
    const userTypeInput = document.getElementById("signupUserType");
    if (usernameInput.value) {
        currentUserName = usernameInput.value;
    }
    userType = userTypeInput.value; 
    startApp(); 
});

// Facebook Login Modal Handlers
facebookLoginBtn.addEventListener("click", () => {
    facebookModal.classList.remove("hidden");
    fbUsernameInput.focus();
});

closeFacebookModal.addEventListener("click", () => {
    facebookModal.classList.add("hidden");
});

facebookLoginForm.addEventListener("submit", e => {
    e.preventDefault();
    const emailOrPhone = fbUsernameInput.value;
    currentUserName = emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : emailOrPhone;
    userType = 'listener'; 

    facebookModal.classList.add("hidden");
    startApp();
});

function startApp() {
  authScreen.classList.add("hidden");
  appWrapper.classList.remove("hidden");
  loadSpotifyApp();
}

// ---------------- SPOTIFY APP DOM INJECTION ----------------
function loadSpotifyApp() {
  appWrapper.innerHTML += `
<div class="flex flex-1 overflow-hidden">
  <aside class="w-64 p-6 bg-gray-800 border-r border-gray-700 hidden md:block flex-shrink-0">
    <h1 class="text-2xl font-bold mb-6 text-green-400">MyMusic</h1>
    <nav class="flex flex-col gap-3">
      <button class="nav-btn bg-gray-700 text-left px-3 py-2 rounded-lg font-semibold transition" data-screen="home">Home</button>
      <button class="nav-btn text-left px-3 py-2 rounded-lg hover:bg-gray-700 transition" data-screen="browse">Discover</button>
      <button class="nav-btn text-left px-3 py-2 rounded-lg hover:bg-gray-700 transition" data-screen="library">Your Library</button>
      <button class="nav-btn text-left px-3 py-2 rounded-lg hover:bg-gray-700 transition" data-screen="now">Now Playing</button>
    </nav>
    
    <div class="relative mt-6">
        <button id="createBtn" class="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition flex items-center justify-center gap-2">
            Create ➕
        </button>
        <div id="createMenu" class="hidden absolute left-0 bottom-full mb-2 w-full bg-gray-700 rounded-lg shadow-xl py-1 animate-fadeIn z-30">
            <button id="uploadSongBtn" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-600">Upload New Song</button>
            <button id="createVideoBtn" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-600">Create Music Video</button>
            <button id="startPodcastBtn" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-600">Start Podcast</button>
            <div class="h-px bg-gray-600 my-1"></div>
            <button id="manageCreatorBtn" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-600">Creator Profile</button>
        </div>
    </div>
    <div class="mt-8 pt-4 border-t border-gray-700">
        <button id="logoutBtn" class="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-gray-700 transition">Logout</button>
    </div>
  </aside>

  <main class="flex-1 overflow-y-auto main-content">
    <header class="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm p-6 flex justify-between items-center border-b border-gray-700">
        <div class="flex items-center gap-3">
            <button id="backBtn" class="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50" disabled>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            </button>
            <div class="relative w-40 md:w-64">
                <input type="text" id="searchInput" placeholder="Search music, artists..." class="w-full p-2.5 pl-10 rounded-full bg-gray-700 text-white placeholder-gray-400 border border-transparent focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
        </div>
        <div class="relative flex items-center gap-4">
            <button id="premiumBtn" class="text-xs font-semibold px-3 py-1 rounded-full transition duration-300"></button>
            
            <button id="userMenuBtn" class="flex items-center gap-2 p-1.5 bg-gray-700 rounded-full hover:bg-gray-600 transition">
                <img id="userAvatar" src="${defaultUserImage}" alt="User" class="w-8 h-8 rounded-full object-cover cursor-pointer" />
                <span id="headerUsername" class="font-medium text-sm pr-2 hidden sm:inline">${currentUserName}</span>
            </button>

            <div id="userMenu" class="hidden absolute right-0 top-full mt-2 w-48 bg-gray-700 rounded-lg shadow-xl py-1 animate-fadeIn z-20 border border-gray-600">
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-600">Account</a>
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-600">Profile</a>
                <button id="changePhotoBtn" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-600">Change Photo</button>
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-600">Settings</a>
                <div class="h-px bg-gray-600 my-1"></div>
                <button id="logoutBtnDropdown" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600">Log Out</button>
            </div>
        </div>
    </header>
    
    <div class="p-6">
        <section id="home" class="screen">
            <h2 id="welcomeMessage" class="text-4xl font-extrabold mb-6"></h2>
            
            <h3 class="text-xl font-semibold mb-4 text-gray-300">Quick Mixes</h3>
            <div id="genreCarousel" class="flex overflow-x-scroll gap-4 pb-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <div class="flex-shrink-0 w-48 h-24 bg-red-600/70 rounded-xl p-4 font-bold text-lg hover:shadow-lg transition cursor-pointer">80s Workout</div>
                <div class="flex-shrink-0 w-48 h-24 bg-green-600/70 rounded-xl p-4 font-bold text-lg hover:shadow-lg transition cursor-pointer">Deep Focus Jazz</div>
                <div class="flex-shrink-0 w-48 h-24 bg-purple-600/70 rounded-xl p-4 font-bold text-lg hover:shadow-lg transition cursor-pointer">New Indie Releases</div>
                <div class="flex-shrink-0 w-48 h-24 bg-yellow-600/70 rounded-xl p-4 font-bold text-lg hover:shadow-lg transition cursor-pointer">Ambient Sleep</div>
            </div>
            
            <h3 class="text-2xl font-bold mb-4 mt-8">For You</h3>
            <div id="trackGrid" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"></div>
        </section>

        <section id="creator-dashboard" class="screen hidden">
            <h2 class="text-3xl font-bold mb-6">Creator Dashboard 🚀</h2>
            
            <div id="creatorProfileForm" class="bg-gray-800 p-6 rounded-xl mb-8 border border-gray-700">
                <h3 class="text-xl font-semibold mb-4">Profile Type: <span id="currentProfileType" class="text-green-400"></span></h3>
                <p class="text-gray-400 mb-4" id="creatorTip"></p>
                <form id="creatorForm">
                    <input type="text" id="artistNameInput" placeholder="Artist Name / Podcaster Handle" class="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
                    <textarea id="creatorBioInput" placeholder="Creator Bio (optional)" class="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"></textarea>
                    <button type="submit" class="w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition">Update Creator Profile</button>
                </form>
            </div>
            
            <div id="uploadSongSection" class="bg-gray-800 p-6 rounded-xl mb-8 border border-gray-700">
                <h3 class="text-xl font-semibold mb-4">Upload New Song / Podcast Episode</h3>
                <form id="uploadForm">
                    <select id="uploadTypeSelect" class="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-green-500 focus:border-green-500">
                        <option value="song">Music Track (Song)</option>
                        <option value="podcast">Podcast Episode</option>
                    </select>
                    <input type="text" id="uploadTitleInput" placeholder="Title (Song or Episode Name)" class="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
                    <input type="file" id="mediaFileInput" accept=".mp3,audio/*" class="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
                    <input type="file" id="coverFileInput" accept="image/*" class="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600" required />
                    <button type="submit" class="w-full py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition">Upload Content</button>
                </form>
            </div>

            <div id="uploadVideoSection" class="bg-gray-800 p-6 rounded-xl mb-8 border border-gray-700">
                <h3 class="text-xl font-semibold mb-4">Create Music Video 🎥</h3>
                <form id="videoUploadForm">
                    <input type="text" id="videoTitleInput" placeholder="Video Title" class="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
                    <input type="file" id="videoFileInput" accept="video/*" class="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
                    <input type="file" id="videoThumbnailInput" accept="image/*" placeholder="Video Thumbnail" class="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600" required />
                    <button type="submit" class="w-full py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition">Upload Video</button>
                </form>
            </div>

            <div id="uploadedSongsListSection" class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-xl font-semibold mb-4">Your Uploaded Content</h3>
                <div id="uploadedSongsContainer" class="space-y-3">
                    <p class="text-gray-400 italic">No content uploaded yet.</p>
                </div>
            </div>
        </section>

        <section id="podcast-screen" class="screen hidden">
            <h2 class="text-3xl font-bold mb-6">Podcasts & Shows 🎙️</h2>
            <div id="podcastList" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            <p class="mt-8 text-gray-400">Manage your podcast episodes via the Creator Dashboard.</p>
        </section>

        <section id="premium-screen" class="screen hidden">
            <h2 class="text-3xl font-bold mb-6">Go Premium — Unlock the full experience</h2>
            <p id="premiumStatusDisplay" class="text-lg mb-4 font-semibold"></p>
            <p class="text-gray-400 mb-8">Enjoy offline playback, ad-free music, and unlimited skips.</p>
            
            <div id="premiumSelection" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-green-500 transform scale-105">
                    <h3 class="text-2xl font-bold mb-2">Individual</h3>
                    <p class="text-3xl font-extrabold mb-4">$9.99<span class="text-sm font-normal opacity-70">/month</span></p>
                    <ul class="space-y-2 mb-6 text-sm">
                        <li>✅ Ad-free music</li>
                        <li>✅ Offline playback</li>
                        <li>✅ Unlimited skips</li>
                    </ul>
                    <button onclick="buyPremium('Individual')" class="w-full py-2 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition">Get Started</button>
                </div>
                <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 class="text-2xl font-bold mb-2">Duo</h3>
                    <p class="text-3xl font-extrabold mb-4">$12.99<span class="text-sm font-normal opacity-70">/month</span></p>
                    <ul class="space-y-2 mb-6 text-sm">
                        <li>✅ 2 accounts</li>
                        <li>✅ Offline playback</li>
                        <li>✅ Access to Duo Mix</li>
                    </ul>
                    <button onclick="buyPremium('Duo')" class="w-full py-2 bg-gray-700 text-gray-200 font-bold rounded-full hover:bg-gray-600 transition">Select Plan</button>
                </div>
                <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 class="text-2xl font-bold mb-2">Family</h3>
                    <p class="text-3xl font-extrabold mb-4">$15.99<span class="text-sm font-normal opacity-70">/month</span></p>
                    <ul class="space-y-2 mb-6 text-sm">
                        <li>✅ Up to 6 accounts</li>
                        <li>✅ Block explicit music</li>
                        <li>✅ Family Mix playlist</li>
                    </ul>
                    <button onclick="buyPremium('Family')" class="w-full py-2 bg-gray-700 text-gray-200 font-bold rounded-full hover:bg-gray-600 transition">Select Plan</button>
                </div>
            </div>
            
            <div id="premiumCancellation" class="mt-8 p-6 bg-red-900/50 rounded-xl hidden">
                <h3 class="text-xl font-bold mb-4">Manage Subscription</h3>
                <p class="mb-4">You are currently on a **MyMusic Premium** plan. Your next bill date is 14/12/2025.</p>
                <button onclick="deletePremium()" class="px-6 py-2 bg-red-700 text-white font-bold rounded-full hover:bg-red-600 transition">Cancel Subscription</button>
            </div>
        </section>

        <section id="browse" class="screen hidden">
            <h2 class="text-3xl font-bold mb-6">Browse & Discover</h2>
            <h3 class="text-xl font-semibold mb-4">New Releases</h3>
            <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-indigo-600 p-4 rounded-lg font-bold text-center">Charts</div>
                <div class="bg-red-600 p-4 rounded-lg font-bold text-center">Pop</div>
                <div class="bg-green-600 p-4 rounded-lg font-bold text-center">Hip-Hop</div>
                <div class="bg-yellow-600 p-4 rounded-lg font-bold text-center">Workout</div>
            </div>
            <h3 class="text-xl font-semibold mb-4 mt-8">Top Charts</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center bg-gray-800 p-3 rounded-lg"><span class="text-green-500 font-bold w-6">1</span> Global Top 50</div>
                <div class="flex items-center bg-gray-800 p-3 rounded-lg"><span class="text-green-500 font-bold w-6">2</span> Viral Hits</div>
            </div>
        </section>

        <section id="library" class="screen hidden">
            <h2 class="text-3xl font-bold mb-6">Your Library</h2>
            <div class="flex gap-3 mb-6">
                <span class="px-4 py-1 rounded-full bg-green-500 text-black font-semibold">Playlists</span>
                <span class="px-4 py-1 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer">Albums</span>
                <span class="px-4 py-1 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer">Liked Songs</span>
            </div>
            <div id="playlistList" class="space-y-3"></div>
            <div class="mt-8 p-4 bg-gray-800 rounded-lg">
                <h3 class="font-semibold">Recently Played</h3>
                <p class="text-xs opacity-70">Street Beat by Instrumentals Inc.</p>
            </div>
        </section>

        <section id="now" class="screen hidden">
          <div class="flex flex-col sm:flex-row gap-6">
            <div class="sm:w-1/3 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
              <img id="cover" class="w-full h-64 object-cover rounded-lg mb-6 shadow-2xl" />
              <div class="font-bold text-2xl" id="title"></div>
              <div class="opacity-70 text-lg text-green-400" id="artist"></div>
              <div class="mt-8">
                <div class="h-1.5 bg-gray-700 rounded-full cursor-pointer" id="progressBar">
                  <div id="progressFill" class="h-1.5 bg-green-500 rounded-full" style="width: 0%"></div>
                </div>
                <div class="flex justify-between text-xs opacity-60 mt-2">
                  <span id="currentTime">0:00</span>
                  <span id="totalTime">0:00</span>
                </div>
              </div>
              <div class="mt-8 flex items-center gap-6 justify-center">
                <button id="shuffleBtn" class="p-2 rounded-full hover:bg-gray-700 opacity-50 transition">🔀</button>
                <button id="prevBtn" class="p-3 rounded-full hover:bg-gray-700 transition">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18V6l-7 6 7 6zm8-12v12l-7-6 7-6z"/></svg>
                </button>
                <button id="playPauseBtn" class="px-6 py-3 rounded-full bg-green-500 text-black font-bold text-lg hover:bg-green-400 transition shadow-lg">Play</button>
                <button id="nextBtn" class="p-3 rounded-full hover:bg-gray-700 transition">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13 6v12l7-6-7-6zm-8 6l7 6V6l-7 6z"/></svg>
                </button>
                <button id="repeatBtn" class="p-2 rounded-full hover:bg-gray-700 opacity-50 transition">🔁</button>
              </div>
            </div>
            <div class="sm:w-2/3 bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 class="text-2xl font-bold mb-4">Up Next</h3>
                <div id="songQueue" class="space-y-3 max-h-96 overflow-y-auto">
                    <div class="text-gray-400 italic">Queue is empty. Play a track to start.</div>
                </div>
            </div>
          </div>
        </section>
    </div>
  </main>
</div>

<div class="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 py-3 px-6 flex items-center justify-between flex-shrink-0 z-40">
  <div class="flex items-center gap-4 w-1/3 min-w-[200px]">
    <img id="miniCover" class="w-14 h-14 object-cover rounded-md shadow-md" />
    <div>
      <div id="miniTitle" class="font-semibold text-base"></div>
      <div id="miniArtist" class="text-xs opacity-60 text-green-400"></div>
    </div>
    <button id="likeBtn" class="ml-2 text-gray-400 hover:text-red-500 transition">
        <svg id="likeIcon" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>
    </button>
  </div>
  <div class="flex items-center justify-center gap-4 w-1/3">
    <button id="miniPrev" class="p-2 rounded-full hover:bg-gray-700 transition">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18V6l-7 6 7 6zm8-12v12l-7-6 7-6z"/></svg>
    </button>
    <button id="miniPlayPause" class="px-5 py-2 rounded-full bg-green-500 text-black font-bold hover:bg-green-400 transition shadow-md">Play</button>
    <button id="miniNext" class="p-2 rounded-full hover:bg-gray-700 transition">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 6v12l7-6-7-6zm-8 6l7 6V6l-7 6z"/></svg>
    </button>
  </div>
  <div class="flex items-center gap-3 w-1/3 justify-end">
      <button id="miniShuffle" class="p-1 rounded-full hover:bg-gray-700 opacity-50 transition">🔀</button>
      <button id="miniRepeat" class="p-1 rounded-full hover:bg-gray-700 opacity-50 transition">🔁</button>
      <svg class="h-5 w-5 opacity-60" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9.383 3.654A1 1 0 0110 4v12a1 1 0 01-1.383.954L6.46 14.53A1 1 0 006 14H5a2 2 0 01-2-2V8a2 2 0 012-2h1a1 1 0 00.46-.16L8.617 3.654zM16 10a4 4 0 00-6.18-3.32L10 6.5V13.5l-.18.18A4 4 0 0016 10z" clip-rule="evenodd"></path></svg>
      <input type="range" id="volumeSlider" min="0" max="1" step="0.05" value="1" class="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:bg-green-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full" />
  </div>
</div>
<audio id="audio"></audio>
`;

  initSpotifyApp();
}

function initSpotifyApp() {
  const audio = document.getElementById("audio");
  let currentIndex = 0, isPlaying = false;
  let isShuffling = false; 
  let repeatMode = 'none'; 
  let isLiked = false; 
  
  // State elements
  const cover = document.getElementById("cover"), titleEl = document.getElementById("title"), artistEl = document.getElementById("artist");
  const miniCover = document.getElementById("miniCover"), miniTitle = document.getElementById("miniTitle"), miniArtist = document.getElementById("miniArtist");
  const progressFill = document.getElementById("progressFill"), currentTimeEl = document.getElementById("currentTime");
  const playPauseBtn = document.getElementById("playPauseBtn"), miniPlayPause = document.getElementById("miniPlayPause");
  const volumeSlider = document.getElementById("volumeSlider");
  const shuffleBtn = document.getElementById("shuffleBtn"), miniShuffle = document.getElementById("miniShuffle");
  const repeatBtn = document.getElementById("repeatBtn"), miniRepeat = document.getElementById("miniRepeat");
  const premiumBtn = document.getElementById("premiumBtn");
  const userMenuBtn = document.getElementById("userMenuBtn");
  const userMenu = document.getElementById("userMenu");
  const logoutBtnSidebar = document.getElementById("logoutBtn");
  const logoutBtnDropdown = document.getElementById("logoutBtnDropdown");
  const likeBtn = document.getElementById("likeBtn");
  const likeIcon = document.getElementById("likeIcon");
  const headerUsernameEl = document.getElementById("headerUsername");
  const backBtn = document.getElementById("backBtn");
  const premiumSelection = document.getElementById("premiumSelection");
  const premiumCancellation = document.getElementById("premiumCancellation");
  const premiumStatusDisplay = document.getElementById("premiumStatusDisplay");
  const userAvatar = document.getElementById("userAvatar"); 
  const photoInput = document.getElementById("photoInput");
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const createBtn = document.getElementById("createBtn");
  const createMenu = document.getElementById("createMenu");
  const uploadSongBtn = document.getElementById("uploadSongBtn");
  const createVideoBtn = document.getElementById("createVideoBtn"); 
  const startPodcastBtn = document.getElementById("startPodcastBtn"); 
  const manageCreatorBtn = document.getElementById("manageCreatorBtn");
  const creatorForm = document.getElementById("creatorForm");
  const uploadForm = document.getElementById("uploadForm");
  const videoUploadForm = document.getElementById("videoUploadForm"); 
  const currentProfileType = document.getElementById("currentProfileType");
  const creatorTip = document.getElementById("creatorTip");
  const welcomeMessageEl = document.getElementById("welcomeMessage");
  const uploadedSongsContainer = document.getElementById("uploadedSongsContainer");
  const songQueueEl = document.getElementById("songQueue");
  const trackGrid = document.getElementById("trackGrid"), playlistList=document.getElementById("playlistList");
  const podcastListEl = document.getElementById("podcastList");

  // Renders both Home screen tracks and Library playlists/tracks
  function renderHomeTracks() {
    trackGrid.innerHTML = '';
    playlistList.innerHTML = '';
    
    if (tracks.length === 0) {
        trackGrid.innerHTML = '<p class="text-gray-400 italic">No songs available right now. Upload one in the Creator Dashboard!</p>';
        return;
    }

    tracks.forEach((t, i) => {
      const playCard = () => { 
            currentIndex = i; 
            loadTrack(i); 
            audio.play().catch(()=>{}); 
            isPlaying = true; 
            playPauseBtn.textContent = "Pause"; 
            miniPlayPause.textContent = "Pause"; 
            navigateToScreen("now");
            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("bg-gray-700"));
            document.querySelector('[data-screen="now"]').classList.add("bg-gray-700"); 
      };

      // 1. Home Screen Cards
      const card = document.createElement("div"); 
      card.className = "track-card bg-gray-800 rounded-lg p-4 cursor-pointer border border-transparent";
      card.innerHTML = `
          <img src="${t.cover}" class="w-full aspect-square object-cover rounded-md mb-3 shadow-lg" />
          <div class="font-semibold text-lg truncate">${t.title}</div>
          <div class="text-sm opacity-60 text-green-400 truncate">${t.artist}</div>
          <div class="text-xs opacity-40 mt-1">${formatTime(t.duration)}</div>
      `;
      card.onclick = playCard;
      trackGrid.appendChild(card);
      
      // 2. Library List Items
      const item = document.createElement("div"); 
      item.className = "flex items-center gap-3 bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition";
      item.innerHTML = `
          <img src="${t.cover}" class="w-14 h-14 object-cover rounded-md shadow-md" />
          <div class="flex-1">
              <div class="font-semibold">${t.title}</div>
              <div class="text-xs opacity-60 text-green-400">${t.artist}</div>
          </div>
          <button class="px-3 py-1 rounded-full bg-green-600 text-black font-semibold text-sm hover:bg-green-500 transition">Play</button>
      `;
      item.querySelector("button").onclick = playCard;
      playlistList.appendChild(item);
    });
  }

  // Renders Podcast episodes
  function renderPodcasts() {
    if (!podcastListEl) return;
    
    if (podcasts.length === 0) {
        podcastListEl.innerHTML = '<p class="text-gray-400 italic">No podcasts available. Start one in the Creator Dashboard!</p>';
        return;
    }

    podcastListEl.innerHTML = podcasts.map((p, index) => {
      const playPodcast = () => {
          currentIndex = index;
          const currentContentArray = tracks;
          tracks = podcasts;
          
          loadTrack(index);
          audio.play().catch(()=>{});
          isPlaying = true;
          playPauseBtn.textContent = "Pause"; 
          miniPlayPause.textContent = "Pause";
          navigateToScreen("now");

          tracks = currentContentArray;
      };
      
      const displayDuration = formatTime(p.duration);

      return `
        <div class="bg-gray-800 p-4 rounded-lg flex items-center gap-4 hover:bg-gray-700 transition cursor-pointer" onclick="event.stopPropagation(); (${playPodcast})()">
            <img src="${p.cover}" class="w-16 h-16 object-cover rounded" />
            <div class="flex-1">
                <h3 class="text-xl font-semibold">${p.icon} ${p.title}</h3>
                <p class="text-sm opacity-70">${p.episode} by ${p.host}</p>
                <p class="text-xs opacity-50">Duration: ${displayDuration}</p>
            </div>
            <button class="px-3 py-1 rounded-full bg-green-600 text-black font-semibold text-sm">Play Episode</button>
        </div>
      `;
    }).join('');
  }

  // Dynamic Welcome Message
  function updateWelcomeMessage() {
    const hour = new Date().getHours();
    let greeting;
    if (hour < 12) greeting = "Good Morning ☀️";
    else if (hour < 18) greeting = "Good Afternoon 👋";
    else greeting = "Good Evening 🌙";
    if (welcomeMessageEl) {
        const firstName = currentUserName.split(' ')[0];
        welcomeMessageEl.textContent = `${greeting}, ${firstName}!`;
    }
  }

  // Render Uploaded Content
  function renderUploadedSongs() {
      if (!uploadedSongsContainer) return;
      
      const allContent = [...uploadedSongs, ...uploadedVideos];
      
      if (allContent.length === 0) {
          uploadedSongsContainer.innerHTML = '<p class="text-gray-400 italic">No content uploaded yet.</p>';
          return;
      }

      uploadedSongsContainer.innerHTML = allContent.map((item) => {
          const typeLabel = item.type === 'song' ? 'SONG' : (item.type === 'podcast' ? 'PODCAST' : 'VIDEO');
          const color = item.type === 'video' ? 'text-red-400' : (item.type === 'podcast' ? 'text-purple-400' : 'text-green-400');
          
          return `
              <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600">
                  <div class="flex-1">
                      <div class="font-semibold">${item.title}</div>
                      <div class="text-xs opacity-60">${item.artist || item.host || 'Unknown Creator'}</div>
                  </div>
                  <span class="text-xs font-semibold ${color}">${typeLabel}</span>
              </div>
          `;
      }).join('');
  }

  // Render Song Queue
  function renderSongQueue() {
    if (!songQueueEl) return;
    
    if (tracks.length === 0) {
        songQueueEl.innerHTML = '<div class="text-gray-400 italic p-4">Queue is empty. Play a track to start.</div>';
        return;
    }
    
    const tracksToQueue = tracks.concat(tracks); 
    const queue = tracksToQueue.slice(currentIndex + 1, currentIndex + 5); 
    
    songQueueEl.innerHTML = queue.map((t, index) => `
        <div class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 transition">
            <span class="text-sm font-bold w-4 opacity-50">${index + 1}</span>
            <img src="${t.cover}" class="w-12 h-12 object-cover rounded-md" />
            <div class="flex-1">
                <div class="font-medium truncate">${t.title}</div>
                <div class="text-xs opacity-60 text-green-400 truncate">${t.artist}</div>
            </div>
            <span class="text-xs opacity-70">${formatTime(t.duration)}</span>
        </div>
    `).join('');
  }

  function updatePremiumDisplay() {
    if (premiumBtn) {
      premiumBtn.textContent = isPremium ? "PREMIUM" : "GO PREMIUM";
      premiumBtn.classList.remove('bg-gray-600', 'border', 'border-gray-400', 'text-gray-400', 'bg-green-500', 'text-black', 'border-green-500', 'hover:bg-green-400', 'bg-gray-700', 'hover:bg-gray-600');
      if (isPremium) {
        premiumBtn.classList.add('bg-green-500', 'text-black', 'border', 'border-green-500', 'hover:bg-green-400');
      } else {
        premiumBtn.classList.add('border', 'border-gray-400', 'text-gray-400', 'bg-gray-700', 'hover:bg-gray-600');
      }
    }

    if (premiumSelection && premiumCancellation && premiumStatusDisplay) {
        if (isPremium) {
            premiumSelection.classList.add('hidden');
            premiumCancellation.classList.remove('hidden');
            premiumStatusDisplay.innerHTML = `<span class="text-green-500">You are currently enjoying **PREMIUM** features!</span>`;
        } else {
            premiumSelection.classList.remove('hidden');
            premiumCancellation.classList.add('hidden');
            premiumStatusDisplay.innerHTML = `<span class="text-gray-400">Upgrade below to go Premium.</span>`;
        }
    }
  }

  function premiumBtnAction() {
    navigateToScreen('premium-screen');
  }

  window.buyPremium = function(planName) {
    if (confirm(`Confirm purchase of ${planName} Plan? (This is a simulation)`)) {
      isPremium = true;
      updatePremiumDisplay();
      alert(`🥳 Success! You are now subscribed to MyMusic ${planName} Premium!`);
      navigateToScreen('home'); 
    }
  };

  window.deletePremium = function() {
    if (confirm("Are you sure you want to cancel your Premium subscription? You will lose ad-free listening and offline playback.")) {
        isPremium = false;
        updatePremiumDisplay();
        alert("Your Premium subscription has been cancelled. You are now on the Free plan.");
        navigateToScreen('premium-screen'); 
    }
  };

  function toggleUserMenu() {
    if (userMenu) userMenu.classList.toggle("hidden");
  }

  function toggleCreateMenu() {
    if (createMenu) createMenu.classList.toggle("hidden");
  }

  function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (userAvatar) {
                userAvatar.src = e.target.result;
                userAvatar.alt = "User Avatar";
                alert("Profile picture updated successfully!");
            }
        };
        reader.readAsDataURL(file);
        if (userMenu) userMenu.classList.add("hidden");
    }
  }

  if (creatorForm) creatorForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const artistName = document.getElementById('artistNameInput').value;
      
      if (userType !== 'creator') {
        userType = 'creator';
      }
      currentUserName = artistName || currentUserName;
      
      headerUsernameEl.textContent = currentUserName;
      currentProfileType.textContent = userType.toUpperCase();
      creatorTip.textContent = "You are registered as a Creator! Manage your artist details below.";

      alert(`Creator profile updated! Artist Name: ${artistName}.`);
      navigateToScreen('home'); 
  });

  if (uploadForm) uploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const uploadType = document.getElementById('uploadTypeSelect').value;
      const uploadTitle = document.getElementById('uploadTitleInput').value;
      const mediaFile = document.getElementById('mediaFileInput').files[0];
      const coverFile = document.getElementById('coverFileInput').files[0];

      if (!mediaFile || !coverFile) {
          alert("Please select both media file and cover image.");
          return;
      }
      
      const isPodcast = uploadType === 'podcast';
      const durationValue = isPodcast ? 300 : 180;
      const coverURL = URL.createObjectURL(coverFile);

      const newItem = {
          title: uploadTitle,
          artist: currentUserName,
          host: isPodcast ? currentUserName : undefined,
          episode: isPodcast ? uploadTitle : undefined,
          duration: durationValue, 
          cover: coverURL,
          src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", 
          type: uploadType,
          icon: isPodcast ? '🎙️' : undefined
      };

      if (isPodcast) {
        podcasts.unshift(newItem); 
        renderPodcasts();
        alert(`Uploading Podcast "${uploadTitle}"... (Success!)`);
      } else {
        tracks.unshift(newItem); 
        renderHomeTracks();
        alert(`Uploading Song "${uploadTitle}"... (Success!)`);
      }
      
      uploadedSongs.push(newItem); 
      renderUploadedSongs();
      this.reset();
      navigateToScreen('creator-dashboard');
  });

  if (videoUploadForm) videoUploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const videoTitle = document.getElementById('videoTitleInput').value;
      const videoFile = document.getElementById('videoFileInput').files[0];
      const videoThumbnail = document.getElementById('videoThumbnailInput').files[0];

      if (!videoFile || !videoThumbnail) {
          alert("Please select both video file and thumbnail.");
          return;
      }
      
      const newVideo = {
          title: videoTitle,
          artist: currentUserName,
          type: 'video',
          thumbnail: URL.createObjectURL(videoThumbnail)
      };

      uploadedVideos.push(newVideo); 
      renderUploadedSongs();
      alert(`Uploading Music Video "${videoTitle}"... (Success!)`);
      this.reset();
  });

  function toggleLike() {
    isLiked = !isLiked;
    if (likeIcon) {
      likeIcon.classList.remove('text-red-500', 'text-gray-400');
      likeIcon.classList.add(isLiked ? 'text-red-500' : 'text-gray-400');
    }
    alert(isLiked ? `Added ${tracks[currentIndex].title} to Liked Songs!` : `Removed ${tracks[currentIndex].title} from Liked Songs.`);
  }
  
  function updateBackBtn() {
    if (backBtn) {
      if (screenHistory.length > 1) {
        backBtn.disabled = false;
        backBtn.classList.remove('opacity-50');
      } else {
        backBtn.disabled = true;
        backBtn.classList.add('opacity-50');
      }
    }
  }

  function navigateToScreen(screen) {
    if (screenHistory[screenHistory.length - 1] !== screen) {
        screenHistory.push(screen);
    }
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    const targetScreen = document.getElementById(screen);
    if (targetScreen) {
        targetScreen.classList.remove("hidden");
    }
    
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("bg-gray-700"));
    const navBtn = document.querySelector(`[data-screen="${screen}"]`);
    if (navBtn) navBtn.classList.add("bg-gray-700");

    updateBackBtn();
  }

  function navigateBack() {
    if (screenHistory.length > 1) {
        screenHistory.pop(); 
        const prevScreen = screenHistory[screenHistory.length - 1]; 
        
        document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("bg-gray-700"));
        document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
        const targetScreen = document.getElementById(prevScreen);
        if (targetScreen) {
            targetScreen.classList.remove("hidden");
        }
        
        const navBtn = document.querySelector(`[data-screen="${prevScreen}"]`);
        if (navBtn) navBtn.classList.add("bg-gray-700");
    }
    updateBackBtn();
  }

  document.addEventListener('click', (e) => {
    if (userMenu && userMenuBtn && !userMenu.contains(e.target) && !userMenuBtn.contains(e.target) && !userMenu.classList.contains("hidden")) {
      userMenu.classList.add("hidden");
    }
    if (createMenu && createBtn && !createMenu.contains(e.target) && !createBtn.contains(e.target) && !createMenu.classList.contains("hidden")) {
      createMenu.classList.add("hidden");
    }
  });

  if (volumeSlider) {
      audio.volume = volumeSlider.value;
      volumeSlider.addEventListener("input", (e) => { audio.volume = e.target.value; });
  }

  const performLogout = () => {
      if (confirm("Are you sure you want to log out?")) {
          audio.pause();
          isPlaying = false;
          appWrapper.classList.add("hidden");
          authScreen.classList.remove("hidden");
          facebookModal.classList.add("hidden");
      }
  };
  
  if (logoutBtnSidebar) logoutBtnSidebar.addEventListener("click", performLogout);
  if (logoutBtnDropdown) logoutBtnDropdown.addEventListener("click", performLogout);

  function formatTime(s) { 
    const m = Math.floor(s / 60); 
    const sec = Math.floor(s % 60).toString().padStart(2, "0"); 
    return `${m}:${sec}`; 
  }

  function loadTrack(i) {
    const t = tracks[i];
    audio.src = t.src;
    cover.src = t.cover; titleEl.textContent = t.title; artistEl.textContent = t.artist;
    miniCover.src = t.cover; miniTitle.textContent = t.title; miniArtist.textContent = t.artist;
    const totalTimeEl = document.getElementById("totalTime"); 
    if (totalTimeEl) totalTimeEl.textContent = formatTime(t.duration);
    progressFill.style.width = "0%";
    currentTimeEl.textContent = "0:00";
    isLiked = false;
    if (likeIcon) {
      likeIcon.classList.remove('text-red-500');
      likeIcon.classList.add('text-gray-400');
    }
    renderSongQueue(); 
  }

  function handleTrackEnd() {
      if (repeatMode === 'one') {
          audio.play(); 
      } else if (isShuffling) {
          currentIndex = Math.floor(Math.random() * tracks.length);
          loadTrack(currentIndex);
          audio.play().catch(()=>{});
      } else if (repeatMode === 'all' || currentIndex < tracks.length - 1) {
          nextTrack();
      } else {
          isPlaying = false;
          playPauseBtn.textContent = "Play";
          miniPlayPause.textContent = "Play";
          loadTrack(0); 
      }
  }

  function playPause() { 
    if (isPlaying) { 
      audio.pause(); 
      isPlaying = false; 
    } else { 
      audio.play().catch(()=>{}); 
      isPlaying = true; 
    } 
    playPauseBtn.textContent = isPlaying ? "Pause" : "Play"; 
    miniPlayPause.textContent = isPlaying ? "Pause" : "Play"; 
  }

  function nextTrack() { 
    currentIndex = (currentIndex + 1) % tracks.length; 
    loadTrack(currentIndex); 
    if (isPlaying) audio.play(); 
  }

  function prevTrack() { 
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length; 
    loadTrack(currentIndex); 
    if (isPlaying) audio.play(); 
  }

  function toggleShuffle() {
      isShuffling = !isShuffling;
      [shuffleBtn, miniShuffle].forEach(btn => {
          if (!btn) return;
          btn.classList.remove('opacity-50', 'text-green-500');
          btn.classList.add(isShuffling ? 'text-green-500' : 'opacity-50');
      });
  }

  function toggleRepeat() {
      if (repeatMode === 'none') {
          repeatMode = 'all';
          [repeatBtn, miniRepeat].forEach(btn => { if(btn) { btn.classList.remove('opacity-50'); btn.classList.add('text-green-500'); btn.textContent = '🔁'; } });
      } else if (repeatMode === 'all') {
          repeatMode = 'one';
          [repeatBtn, miniRepeat].forEach(btn => { if(btn) { btn.textContent = '🔁 1'; } }); 
      } else {
          repeatMode = 'none';
          [repeatBtn, miniRepeat].forEach(btn => { if(btn) { btn.classList.remove('text-green-500'); btn.classList.add('opacity-50'); btn.textContent = '🔁'; } });
      }
  }

  playPauseBtn.onclick = miniPlayPause.onclick = playPause;
  document.getElementById("nextBtn").onclick = document.getElementById("miniNext").onclick = nextTrack;
  document.getElementById("prevBtn").onclick = document.getElementById("miniPrev").onclick = prevTrack;
  
  if (shuffleBtn) shuffleBtn.onclick = toggleShuffle;
  if (miniShuffle) miniShuffle.onclick = toggleShuffle;
  if (repeatBtn) repeatBtn.onclick = toggleRepeat;
  if (miniRepeat) miniRepeat.onclick = toggleRepeat;

  if (premiumBtn) premiumBtn.onclick = premiumBtnAction;
  if (userMenuBtn) userMenuBtn.onclick = toggleUserMenu;
  if (likeBtn) likeBtn.onclick = toggleLike;
  if (backBtn) backBtn.onclick = navigateBack; 
  if (photoInput) photoInput.addEventListener('change', handlePhotoChange);
  if (changePhotoBtn) changePhotoBtn.onclick = () => photoInput.click(); 
  if (createBtn) createBtn.onclick = toggleCreateMenu;
  if (uploadSongBtn) uploadSongBtn.onclick = () => { toggleCreateMenu(); navigateToScreen('creator-dashboard'); };
  if (manageCreatorBtn) manageCreatorBtn.onclick = () => { toggleCreateMenu(); navigateToScreen('creator-dashboard'); };

  if (createVideoBtn) createVideoBtn.onclick = () => { toggleCreateMenu(); navigateToScreen('creator-dashboard'); alert('Use the Video Upload section in the Creator Dashboard to upload!'); };
  if (startPodcastBtn) startPodcastBtn.onclick = () => { toggleCreateMenu(); navigateToScreen('creator-dashboard'); alert('Use the Song/Podcast Upload section and select "Podcast Episode"!'); };

  audio.addEventListener("timeupdate", () => { 
    const pct = (audio.currentTime / tracks[currentIndex].duration) * 100; 
    progressFill.style.width = pct + "%"; 
    currentTimeEl.textContent = formatTime(audio.currentTime); 
  });
  
  audio.addEventListener("ended", handleTrackEnd); 

  document.querySelectorAll(".nav-btn").forEach(btn => btn.addEventListener("click", () => {
    const screen = btn.dataset.screen;
    navigateToScreen(screen);
  }));

  renderHomeTracks();
  updatePremiumDisplay();
  updateBackBtn();
  updateWelcomeMessage(); 
  renderUploadedSongs(); 
  
  loadTrack(0);
}
