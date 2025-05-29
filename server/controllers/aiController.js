const { OpenAI } = require('openai');
const { Tutor, User } = require('../models');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class AIController {
    static async chatRecommendation(req, res, next) {
        try {
            const { messages } = req.body;
            const tutors = await Tutor.findAll({
                include: [{ model: User, attributes: ['fullName', 'email'] }],
                limit: 10
            });

            const tutorList = tutors.map(t =>
                `Nama: ${t.User.fullName}, Subjek: ${t.subjects}, Gaya: ${t.style}`
            ).join('\n');

            const systemPrompt = {
                role: 'system',
                content: `Berikut adalah daftar tutor:\n${tutorList}\nGunakan data ini untuk merekomendasikan tutor yang cocok berdasarkan preferensi user.`
            };

            const aiMessages = [systemPrompt, ...messages];

            const completion = await openai.chat.completions.create({
                model: "gpt-4.1-nano",
                messages: aiMessages,
                max_tokens: 200,
            });
            console.log('API KEY:', process.env.OPENAI_API_KEY);
            res.json({ reply: completion.choices[0].message.content });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}
module.exports = AIController;