import React from 'react';
import { useSelector } from 'react-redux';
import Feed from './feed';
import PostForm from './postForm'

export default function Dashboard() {
    const user = useSelector(state => state.auth.user)

    return (
        <div className='posts'>
            <PostForm />
            <Feed a={0} />
        </div>
    )
}
