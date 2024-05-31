export const generateToken = (user, res) => {
    const token = user.generateJsonWebToken();

    const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

    res.cookie(cookieName, token, {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    })

    return token
}