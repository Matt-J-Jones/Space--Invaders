const MOVE_SPEED = 200
const INVADER_SPEED = 100
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 100
const TIME_LEFT = 45
const BULLET_SPEED = 400

layer(['obj', 'ui'], 'obj')

addLevel([
  '!^^^^^^^^^^  &',
  '!^^^^^^^^^^  &',
  '!^^^^^^^^^^  &',
  '!            &',
  '!            &',
  '!            &',
  '!            &',
  '!            &',
  '!            &',
], {
    width: 30,
    height: 20,
    '^': [sprite('spaceinvader'), scale(0.75), 'space-invader'],
    '!': [sprite('wall'), 'left-wall'],
    '&': [sprite('wall'), 'right-wall'],
  })

const player = add([
  sprite('space-ship'),
  pos(width() / 2, height()),
  origin('center'),
])

function spawnBullet(p) {
  add([
    rect(6, 18),
    pos(p),
    origin('center'),
    color(0.5, 0.5, 1),
    'bullet'
  ])
}

keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

keyPress('space', () => {
  spawnBullet(player.pos.add(0, -25))
})

action('bullet', (b) => {
  b.move(0, -BULLET_SPEED)
  if (b.pos.y < 0) {
    destroy(b)
  }
})

collides('bullet', 'space-invader', (b, s) => {
  camShake(4)
  destroy(b)
  destroy(s)
  score.value++
  score.text = score.value
})

const score = add([
  text('0'),
  pos(0, 5),
  layer('ui'),
  scale(1.8),
  {
    value: 0,
  }
])

const timer = add([
  text('0'),
  pos(0, 25),
  scale(1.8),
  layer('ui'),
  {
    time: TIME_LEFT,
  }
])

timer.action(() => {
  timer.time -= dt()
  timer.text = timer.time.toFixed(0)
  if (timer.time <= 0) {
    go('gameover', { score: score.value })
  }
})

score.action(() => {
  if (score.value >= 30) {
    go('level2', { score: score.value })
  }
})

action('space-invader', (s) => {
  s.move(CURRENT_SPEED, 0)
})

collides('space-invader', 'right-wall', () => {
  CURRENT_SPEED = -INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

collides('space-invader', 'left-wall', () => {
  CURRENT_SPEED = INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

player.overlaps('space-invader', () => {
  go('gameover', { score: score.value })
})

action('space-invader', (s) => {
  if (s.pos.y >= height()) {
    go('gameover', { score: score.value })
  }
})

