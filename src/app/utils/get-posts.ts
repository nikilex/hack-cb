import { cache } from 'react'
 
export const revalidate = 3600 // revalidate the data at most every hour
 
export const getPosts = cache(async (id: string) => {
  return {
    id: 1,
    title: "new text post",
  }
})