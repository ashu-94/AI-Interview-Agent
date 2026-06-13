import User from '../models/user.model.js'


export const getCurrentUser = async (req, res) => {
    try {
        console.log("USER ID:", req.userId);

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}