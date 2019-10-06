export type GetMapping = {
  'https://sugoku.herokuapp.com/board': [
    {
      difficulty: 'easy' | 'medium' | 'hard' | 'random'
    },
    {
      board: number[][]
    },
  ]
}

export type PostMapping = {
  'https://sugoku.herokuapp.com/validate': [
    {
      board: number[][]
    },
    {
      status: 'unsolved' | 'solved' | 'broken'
    },
  ]
}

export async function get<TPath extends keyof GetMapping>(
  path: TPath,
  params: GetMapping[TPath][0],
): Promise<GetMapping[TPath][1]> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => query.set(k, v))

  return fetch(`${path}?${query}`, {
    method: 'GET',
  }).then(resp => resp.json())
}

export async function post<TPath extends keyof PostMapping>(
  path: TPath,
  params: PostMapping[TPath][0],
): Promise<PostMapping[TPath][1]> {
  const data = new FormData()
  Object.entries(params).map(([k, v]) => data.append(k, JSON.stringify(v)))

  return fetch(path, {
    method: 'POST',
    body: data,
  }).then(resp => resp.json())
}
