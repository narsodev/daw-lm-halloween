const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

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

const makeJumpscare = (img, audio, onEnd = () => {}) => {
  img.classList.toggle('hidden')

  audio.currentTime = 1
  audio.play()

  audio.addEventListener('ended', () => {
    img.classList.toggle('hidden')
    onEnd()
  })
}

const scenes = {
  menu: $('.scene.menu'),
  house: $('.scene.house'),
  hall: $('.scene.hall'),
  lockedDoor: $('.scene.locked-door'),
  end: $('.scene.end')
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

  const onEnd = () => {
    backgroundAudio.volume = 1
    textHouse.classList.toggle('hidden')

    const jumpscare = $('#jumpscare-1')
    const [activator, audio, img, windowsText] = jumpscare.children

    windowsText.classList.toggle('hidden')

    activator.addEventListener('mouseover', () => {
      makeJumpscare(img, audio)
      windowsText.classList.toggle('hidden')
    }, ({ once: true }))

    const door = $('#door')
    door.addEventListener('click', () => {
      scenes.house.classList.toggle('hidden')
      scenes.hall.classList.toggle('hidden')
    })
  }

  const textHouse = $('#text-house')
  speak({
    text: `Hi ${playername}.
      I am trapped in this house.
      Can you come into and help me escape?
      I need to find a way out.
      Try no to look through the windows.
    `,
    onStart: () => {
      backgroundAudio.volume = 0.5
    },
    onEnd
  })
})
sceneHouseObserver.observe(scenes.house, { attributes: true })

const sceneHallObserver = new MutationObserver(() => {
  sceneHallObserver.disconnect()

  const onEnd = () => {
    backgroundAudio.volume = 1
    textStairs.classList.toggle('hidden')

    const jumpscare = $('#jumpscare-2')
    const [activator, audio, img, stairsAudio, activatorText] = jumpscare.children

    activatorText.classList.toggle('hidden')

    audio.volume = 0.8

    activator.addEventListener('mouseover', () => {
      makeJumpscare(img, audio, () => {
        jumpscare.classList.toggle('hidden')
        stairsAudio.play()
        if (!activatorText.classList.contains('hidden')) activatorText.classList.toggle('hidden')
      })
    }, ({ once: true }))

    const stairs = $$('.door-stairs')
    stairs.forEach(stair => {
      stair.addEventListener('click', () => {
        scenes.hall.classList.toggle('hidden')
        scenes.lockedDoor.classList.toggle('hidden')
      })
    })
  }

  const textStairs = $('#text-stairs')
  speak({
    text: `She can't see you unless you look directly at her.
      I am downstairs. I think someone's after me.
      Be careful.
    `,
    onStart: () => {
      backgroundAudio.volume = 0.5
    },
    onEnd
  })
})
sceneHallObserver.observe(scenes.hall, { attributes: true })

const sceneLockedDoorObserver = new MutationObserver(() => {
  sceneLockedDoorObserver.disconnect()

  const onEnd = () => {
    backgroundAudio.volume = 1
    const lockedDoorWrapper = $('#locked-door-wrapper')
    const [activator, audio, doorActivatorText] = lockedDoorWrapper.children
    doorActivatorText.classList.toggle('hidden')

    audio.volume = 0.05

    activator.addEventListener('click', () => {
      doorActivatorText.classList.toggle('hidden')

      setTimeout(() => {
        audio.play()
      }, 2000)
      speak({
        text: `Oh no! There's someone else here.
          Behind you!
          He is going to get you!
          You're going to die.
        `,
        onEnd: () => {
          audio.volume = 1
          scenes.lockedDoor.classList.toggle('hidden')
          scenes.end.classList.toggle('hidden')
        }
      })
    }, { once: true })
  }

  speak({
    text: `I think I'm behind the door.
    Can you try to open it?
    `,
    onStart: () => {
      backgroundAudio.volume = 0.5
    },
    onEnd
  })
})
sceneLockedDoorObserver.observe(scenes.lockedDoor, { attributes: true })
