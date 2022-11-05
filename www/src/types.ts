
type Post = any;
type UserProfile = any;

interface ResponseFormat<T> {
    data: T | null;
    error: any | null;
}

// OAUTH: 
// - Authenticate with GitHub creates a new user in the database.
// - You must visit this URL in a browser. It returns its response via redirect.
function request(url: '/login', params: {}): Promise<ResponseFormat<undefined>>;
// RPC: 
// - JSON requests/responses for executing commands against the API.
// - On success, {data} is populated and {error} is null.
// - On failure, {error} is populated and {data} is null.
function request(url: '/api/feed.list', params: {user: string}): Promise<ResponseFormat<Post[]>>;
function request(url: '/api/users.info', params: {user: string}): Promise<ResponseFormat<UserProfile>>;
function request(url: '/api/users.list', params: {}): Promise<ResponseFormat<UserProfile[]>>;
function request(url: '/api/posts.info', params: {post: string}): Promise<ResponseFormat<Post>>;
function request(url: '/api/posts.list', params: {user: string}): Promise<ResponseFormat<Post[]>>;
function request(url: '/api/posts.create', params: {content: string}): Promise<ResponseFormat<Post>>;
function request(url: '/api/posts.interact', params: {post: string, action: 'like' | 'share'}): Promise<ResponseFormat<boolean>>;
function request(url: '/api/relationships.create', params: {user: string}): Promise<ResponseFormat<boolean>>;
function request(url: '/api/relationships.delete', params: {user: string}): Promise<ResponseFormat<boolean>>;
// IGNORE: Placeholder implementation to make TS happy.
async function request(url: string, params: any): Promise<ResponseFormat<any>> {
    return {data: null, error: null };
}

export {}