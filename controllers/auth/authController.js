const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../Prisma-Client'); // Ensure this path is correct for your project
// POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Check if the user already exists
        const existingUser = await prisma.users.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email.' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message: 'User registered successfully!',
            newUser: newUser,

        });
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found, kindly register first' });

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};




module.exports = { registerUser, loginUser };
