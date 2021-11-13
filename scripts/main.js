const $ = document.querySelector.bind(document)

let playername

const backgroundAudio = $('#background-audio')
backgroundAudio.currentTime = 2

const makeJumpscare = (img, audio) => {
  img.classList.toggle('hidden')

  audio.currentTime = 1
  audio.play()

  audio.addEventListener('ended', () => {
    img.classList.toggle('hidden')
    console.log('ended')
  })
}

const scenes = {
  menu: $('.menu'),
  house: $('.house')
}

const nameInput = $('#name')

const form = document.querySelector('.menu form')

form.addEventListener('submit', e => {
  e.preventDefault()

  playername = nameInput.value

  scenes.menu.classList.toggle('hidden')
  scenes.house.classList.toggle('hidden')
})

const sceneHouseObserver = new MutationObserver(mutations => {
  sceneHouseObserver.disconnect()
  backgroundAudio.play()

  const jumpscare = $('#jumpscare-1')
  const [activator, audio, img] = jumpscare.children
  activator.addEventListener('mouseover', () => {
    makeJumpscare(img, audio)
  })
})
sceneHouseObserver.observe(scenes.house, { attributes: true })
