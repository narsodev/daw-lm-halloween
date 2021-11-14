const $ = document.querySelector.bind(document)

const synth = window.speechSynthesis

const speak = (
  {
    text,
    config = {
      voice: 'Google UK English Male',
      pitch: 0.4,
      rate: 0.8
    },
    onStart = () => {},
    onEnd = () => {}
  }
) => {
  if (synth.speaking) {
    console.error('speechSynthesis.speaking')
    return
  }
  const utterThis = new SpeechSynthesisUtterance(text)
  utterThis.volume = 1
  utterThis.onerror = () => {
    alert('Error speaking')
    console.error('Error speaking')
  }
  utterThis.onstart = onStart
  utterThis.onend = onEnd

  const { voice, pitch, rate } = config

  utterThis.voice = synth.getVoices().find(voiceObject => voiceObject.name === voice)
  utterThis.pitch = pitch
  utterThis.rate = rate

  window.speechSynthesis.cancel()
  synth.speak(utterThis)
}

let playername

const backgroundAudio = $('#background-audio')
backgroundAudio.currentTime = 2

const makeJumpscare = (img, audio) => {
  img.classList.toggle('hidden')

  audio.currentTime = 1
  audio.play()

  audio.addEventListener('ended', () => {
    img.classList.toggle('hidden')
  })
}

const scenes = {
  menu: $('.scene.menu'),
  house: $('.scene.house'),
  hall: $('.scene.hall')
}

const nameInput = $('#name')

const form = document.querySelector('.menu form')

form.addEventListener('submit', e => {
  e.preventDefault()

  playername = nameInput.value

  scenes.menu.classList.toggle('hidden')
  scenes.house.classList.toggle('hidden')
})

const sceneHouseObserver = new MutationObserver(() => {
  sceneHouseObserver.disconnect()

  backgroundAudio.volume = 0.5
  backgroundAudio.play()

  speak({
    text: `Hi ${playername}.
    I am trapped in this house.
    Can you go in and help me escape?
    I need to find a way out.
    Try no to look through the windows.
    `,
    onStart: () => {
      backgroundAudio.volume = 0.5
    },
    onEnd: () => {
      backgroundAudio.volume = 1
    }
  })

  const jumpscare = $('#jumpscare-1')
  const [activator, audio, img] = jumpscare.children
  activator.addEventListener('mouseover', () => {
    makeJumpscare(img, audio)
  }, ({ once: true }))

  const door = $('#door')
  door.addEventListener('click', () => {
    scenes.house.classList.toggle('hidden')
    scenes.hall.classList.toggle('hidden')
  })
})
sceneHouseObserver.observe(scenes.house, { attributes: true })

const sceneHallObserver = new MutationObserver(() => {
  sceneHallObserver.disconnect()
})
sceneHallObserver.observe(scenes.hall, { attributes: true })
