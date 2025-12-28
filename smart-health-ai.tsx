import React, { useState } from 'react';
import { Pill, MessageCircle, Apple, AlertTriangle, Sun, Sunset, Moon, Activity, Sparkles, ChevronRight, X } from 'lucide-react';

// Mock interaction data
const medicineInteractions = {
  'paracetamol': ['ibuprofen', 'aspirin'],
  'ibuprofen': ['paracetamol', 'aspirin', 'warfarin'],
  'aspirin': ['paracetamol', 'ibuprofen', 'warfarin'],
  'warfarin': ['ibuprofen', 'aspirin'],
  'metformin': ['insulin'],
  'insulin': ['metformin']
};

// Mock symptom checker data
const symptomDiseaseMap = {
  'fever,cough,headache': 'Common Cold or Flu',
  'fever,cough': 'Upper Respiratory Infection',
  'headache,nausea': 'Migraine or Tension Headache',
  'fever,fatigue': 'Viral Infection',
  'cough,chest pain': 'Bronchitis or Pneumonia',
  'stomach pain,nausea': 'Gastroenteritis',
  'fatigue,weakness': 'Anemia or Vitamin Deficiency'
};

// Mock nutrition deficiency logic
const checkDeficiency = (age, gender, diet, symptoms) => {
  const deficiencies = [];
  
  if (symptoms.includes('fatigue') || symptoms.includes('weakness')) {
    deficiencies.push({
      name: 'Iron Deficiency',
      foods: ['Spinach', 'Red Meat', 'Lentils', 'Tofu'],
      icon: '🥬'
    });
    deficiencies.push({
      name: 'Vitamin B12',
      foods: ['Eggs', 'Dairy', 'Fortified Cereals', 'Fish'],
      icon: '🥚'
    });
  }
  
  if (symptoms.includes('hair loss') || symptoms.includes('dry skin')) {
    deficiencies.push({
      name: 'Vitamin D',
      foods: ['Sunlight', 'Salmon', 'Egg Yolks', 'Fortified Milk'],
      icon: '☀️'
    });
  }
  
  if (symptoms.includes('weak bones') || symptoms.includes('muscle cramps')) {
    deficiencies.push({
      name: 'Calcium',
      foods: ['Milk', 'Cheese', 'Broccoli', 'Almonds'],
      icon: '🥛'
    });
  }
  
  if (diet === 'veg' && age > 40) {
    deficiencies.push({
      name: 'Vitamin B12',
      foods: ['Fortified Cereals', 'Nutritional Yeast', 'Plant Milk'],
      icon: '🌾'
    });
  }
  
  return deficiencies.length > 0 ? deficiencies : [{
    name: 'No Major Deficiencies Detected',
    foods: ['Maintain Balanced Diet', 'Stay Hydrated', 'Regular Exercise'],
    icon: '✅'
  }];
};

export default function SmartHealthAI() {
  const [activeTab, setActiveTab] = useState('home');
  const [medicines, setMedicines] = useState([]);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    dosage: '',
    time: 'morning',
    duration: ''
  });
  const [interactions, setInteractions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [nutritionForm, setNutritionForm] = useState({
    age: '',
    gender: 'male',
    diet: 'non-veg',
    symptoms: []
  });
  const [nutritionResults, setNutritionResults] = useState(null);

  const timeIcons = {
    morning: <Sun className="w-5 h-5" />,
    afternoon: <Sunset className="w-5 h-5" />,
    night: <Moon className="w-5 h-5" />
  };

  const checkInteractions = (newMedicines) => {
    const foundInteractions = [];
    for (let i = 0; i < newMedicines.length; i++) {
      for (let j = i + 1; j < newMedicines.length; j++) {
        const med1 = newMedicines[i].name.toLowerCase();
        const med2 = newMedicines[j].name.toLowerCase();
        
        if (medicineInteractions[med1]?.includes(med2)) {
          foundInteractions.push(`${newMedicines[i].name} and ${newMedicines[j].name}`);
        }
      }
    }
    setInteractions(foundInteractions);
  };

  const addMedicine = () => {
    if (!medicineForm.name || !medicineForm.dosage || !medicineForm.duration) return;
    
    const newMedicine = { ...medicineForm, id: Date.now() };
    const updatedMedicines = [...medicines, newMedicine];
    setMedicines(updatedMedicines);
    checkInteractions(updatedMedicines);
    setMedicineForm({ name: '', dosage: '', time: 'morning', duration: '' });
  };

  const removeMedicine = (id) => {
    const updatedMedicines = medicines.filter(m => m.id !== id);
    setMedicines(updatedMedicines);
    checkInteractions(updatedMedicines);
  };

  const sendSymptom = () => {
    if (!symptomInput.trim()) return;
    
    const userMessage = { type: 'user', text: symptomInput };
    setChatMessages([...chatMessages, userMessage]);
    setIsTyping(true);
    
    setTimeout(() => {
      const symptoms = symptomInput.toLowerCase();
      let disease = 'Please describe your symptoms more specifically';
      
      Object.keys(symptomDiseaseMap).forEach(key => {
        const keySymptoms = key.split(',');
        const matchCount = keySymptoms.filter(s => symptoms.includes(s)).length;
        if (matchCount >= 2) {
          disease = symptomDiseaseMap[key];
        }
      });
      
      const aiResponse = {
        type: 'ai',
        text: disease === 'Please describe your symptoms more specifically' 
          ? disease 
          : `Based on your symptoms, you might have: ${disease}. ⚠️ This is not medical advice. Please consult a healthcare professional for proper diagnosis.`
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      setSymptomInput('');
    }, 1500);
  };

  const checkNutrition = () => {
    if (!nutritionForm.age) return;
    const results = checkDeficiency(
      nutritionForm.age,
      nutritionForm.gender,
      nutritionForm.diet,
      nutritionForm.symptoms
    );
    setNutritionResults(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/70 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
                  Smart Health AI
                </h1>
                <p className="text-xs text-gray-400">Powered by AI</p>
              </div>
            </div>
            <div className="hidden md:flex space-x-2">
              {[
                { id: 'home', label: 'Home', icon: <Activity className="w-4 h-4" /> },
                { id: 'medicine', label: 'Medicine', icon: <Pill className="w-4 h-4" /> },
                { id: 'symptoms', label: 'Symptoms', icon: <MessageCircle className="w-4 h-4" /> },
                { id: 'nutrition', label: 'Nutrition', icon: <Apple className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-900/90 border-t border-gray-700/50">
        <div className="flex justify-around py-4 px-2">
          {[
            { id: 'home', icon: <Activity className="w-5 h-5" /> },
            { id: 'medicine', icon: <Pill className="w-5 h-5" /> },
            { id: 'symptoms', icon: <MessageCircle className="w-5 h-5" /> },
            { id: 'nutrition', icon: <Apple className="w-5 h-5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {/* Home */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            <div className="text-center space-y-4 pt-8">
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300">AI-Powered Healthcare</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                Your Health,
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
                  Simplified
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Intelligent health management at your fingertips. Track medicines, check symptoms, and optimize nutrition.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: <Pill className="w-8 h-8" />, 
                  title: 'Medicine Reminder', 
                  desc: 'Smart medication tracking with interaction detection', 
                  gradient: 'from-blue-500 to-cyan-500',
                  badge: 'Smart AI'
                },
                { 
                  icon: <MessageCircle className="w-8 h-8" />, 
                  title: 'Symptom Checker', 
                  desc: 'AI-powered analysis for quick health insights', 
                  gradient: 'from-emerald-500 to-teal-500',
                  badge: 'AI Chat'
                },
                { 
                  icon: <Apple className="w-8 h-8" />, 
                  title: 'Nutrition Guide', 
                  desc: 'Personalized nutrition recommendations', 
                  gradient: 'from-purple-500 to-pink-500',
                  badge: 'Personalized'
                }
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-gray-600 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  <div className="absolute top-4 right-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-700/50 text-gray-300 border border-gray-600/50">
                      {feature.badge}
                    </span>
                  </div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{feature.desc}</p>
                  <div className="flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                    Learn more <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20">
                <h3 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h3>
                <div className="space-y-4">
                  {['AI-powered health insights', 'Real-time interaction checking', 'Personalized recommendations', 'Privacy-focused design'].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20">
                <h3 className="text-2xl font-bold text-white mb-4">Get Started</h3>
                <p className="text-gray-300 mb-6">Begin your health journey today with our comprehensive suite of AI-powered tools.</p>
                <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300">
                  Explore Features
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Medicine Reminder */}
        {activeTab === 'medicine' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-white">Medicine Manager</h2>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2">
                <span className="text-blue-300 text-sm font-medium">{medicines.length} Active</span>
              </div>
            </div>
            
            {interactions.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-red-400 mb-2 text-lg">Interaction Warning</h4>
                    {interactions.map((interaction, idx) => (
                      <p key={idx} className="text-red-300 text-sm leading-relaxed">
                        ⚠️ Potential interaction detected between {interaction}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                    <Pill className="w-4 h-4 text-blue-400" />
                  </div>
                  Add Medicine
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Medicine Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Paracetamol"
                      value={medicineForm.name}
                      onChange={(e) => setMedicineForm({...medicineForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g., 500mg"
                      value={medicineForm.dosage}
                      onChange={(e) => setMedicineForm({...medicineForm, dosage: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Time of Day</label>
                    <select
                      value={medicineForm.time}
                      onChange={(e) => setMedicineForm({...medicineForm, time: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="night">Night</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Duration (days)</label>
                    <input
                      type="number"
                      placeholder="e.g., 7"
                      value={medicineForm.duration}
                      onChange={(e) => setMedicineForm({...medicineForm, duration: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button 
                    onClick={addMedicine}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:transform hover:-translate-y-0.5"
                  >
                    Add to Schedule
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-6">Today's Schedule</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {medicines.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Pill className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-gray-500">No medicines added yet</p>
                      <p className="text-sm text-gray-600 mt-2">Add your first medicine to get started</p>
                    </div>
                  ) : (
                    medicines.map(med => (
                      <div key={med.id} className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-5 hover:border-gray-600 transition-all group">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-bold text-white text-lg">{med.name}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                {med.dosage}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-3">
                              <div className="flex items-center space-x-2 text-gray-400">
                                {timeIcons[med.time]}
                                <span className="text-sm capitalize">{med.time}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {med.duration} days
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeMedicine(med.id)}
                            className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Symptom Checker */}
        {activeTab === 'symptoms' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-3">AI Symptom Checker</h2>
              <p className="text-gray-400">Describe your symptoms and get instant AI-powered insights</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden">
              <div className="h-[500px] overflow-y-auto p-8 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">How can I help you today?</h3>
                    <p className="text-gray-400">Describe your symptoms in detail</p>
                  </div>
                )}
                
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-md px-6 py-4 rounded-2xl ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-gray-800/80 border border-gray-700/50 text-gray-200'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800/80 border border-gray-700/50 px-6 py-4 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-gray-900/50 border-t border-gray-700/50">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Describe your symptoms (e.g., fever, cough, headache)..."
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendSymptom()}
                    className="flex-1 px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    onClick={sendSymptom}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:transform hover:-translate-y-0.5"
                  >
                    Send
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  ⚠️ This is not medical advice. Always consult a healthcare professional.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nutrition Checker */}
        {activeTab === 'nutrition' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-3">Nutrition Deficiency Checker</h2>
              <p className="text-gray-400">Get personalized nutrition insights based on your health profile</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                    <Apple className="w-4 h-4 text-purple-400" />
                  </div>
                  Your Profile
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                    <input
                      type="number"
                      placeholder="Enter your age"
                      value={nutritionForm.age}
                      onChange={(e) => setNutritionForm({...nutritionForm, age: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Gender</label>
                    <select
                      value={nutritionForm.gender}
                      onChange={(e) => setNutritionForm({...nutritionForm, gender: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Diet Type</label>
                    <select
                      value={nutritionForm.diet}
                      onChange={(e) => setNutritionForm({...nutritionForm, diet: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                      <option value="vegan">Vegan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Symptoms</label>
                    <div className="space-y-3">
                      {['fatigue', 'weakness', 'hair loss', 'dry skin', 'weak bones', 'muscle cramps'].map(symptom => (
                        <label key={symptom} className="flex items-center space-x-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={nutritionForm.symptoms.includes(symptom)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNutritionForm({...nutritionForm, symptoms: [...nutritionForm.symptoms, symptom]});
                                } else {
                                  setNutritionForm({...nutritionForm, symptoms: nutritionForm.symptoms.filter(s => s !== symptom)});
                                }
                              }}
                              className="w-5 h-5 bg-gray-900 border-2 border-gray-700 rounded-lg appearance-none checked:bg-purple-500 checked:border-purple-500 transition-all cursor-pointer"
                            />
                            <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none opacity-0 checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-300 capitalize group-hover:text-white transition-colors">{symptom}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={checkNutrition}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:transform hover:-translate-y-0.5 mt-6"
                  >
                    Analyze My Nutrition
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-6">Analysis Results</h3>
                {!nutritionResults ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Apple className="w-10 h-10 text-gray-600" />
                    </div>
                    <p className="text-gray-500 text-lg">Fill in your profile to see results</p>
                    <p className="text-sm text-gray-600 mt-2">Get personalized nutrition recommendations</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {nutritionResults.map((result, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all">
                        <div className="flex items-start space-x-4">
                          <div className="text-4xl">{result.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-purple-300 text-lg mb-3">{result.name}</h4>
                            <p className="text-sm text-gray-400 mb-3">Recommended Foods:</p>
                            <div className="flex flex-wrap gap-2">
                              {result.foods.map((food, foodIdx) => (
                                <span key={foodIdx} className="bg-gray-900/50 px-4 py-2 rounded-xl text-sm text-gray-300 border border-gray-700/50 hover:border-purple-500/30 transition-all">
                                  {food}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}