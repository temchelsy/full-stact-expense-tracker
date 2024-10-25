import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

function ExpenseForm() {
    const { addExpense, error, setError } = useGlobalContext();
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: null,
        category: '',
        description: '',
    });

    const { title, amount, date, category, description } = inputState;

    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addExpense({
                ...inputState,
                amount: Number(amount),
            });
            setInputState({
                title: '',
                amount: '',
                date: null,
                category: '',
                description: '',
            });
        } catch (error) {
            console.error('Error adding expense:', error);
            setError('Failed to add expense');
        }
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            
            <div className="input-control">
                <input 
                    type="text" 
                    value={title}
                    name="title" 
                    placeholder="Expense Title"
                    onChange={handleInput('title')}
                />
            </div>

            <div className="input-control">
                <input 
                    value={amount}  
                    type="number"
                    name="amount" 
                    placeholder="Expense Amount"
                    onChange={handleInput('amount')} 
                />
            </div>

            <div className="input-control">
                <DatePicker 
                    id="date"
                    placeholderText="Enter A Date"
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => setInputState({ ...inputState, date })}
                />
            </div>

            <div className="input-control">
                <select 
                    required 
                    value={category} 
                    name="category" 
                    id="category" 
                    onChange={handleInput('category')}
                >
                    <option value="" disabled>Select Category</option>
                    <option value="education">Education</option>
                    <option value="groceries">Groceries</option>
                    <option value="health">Health</option>
                    <option value="subscriptions">Subscriptions</option>
                    <option value="takeaways">Takeaways</option>
                    <option value="clothing">Clothing</option>  
                    <option value="travelling">Travelling</option>  
                    <option value="other">Other</option>  
                </select>
            </div>

            <div className="input-control">
                <textarea 
                    name="description" 
                    value={description} 
                    placeholder="Add A Reference" 
                    id="description" 
                    cols="30" 
                    rows="4" 
                    onChange={handleInput('description')}
                ></textarea>
            </div>

            <div className="submit-btn">
                <Button 
                    name="Add Expense"
                    icon={plus}
                    bPad=".8rem 1.6rem"
                    bRad="30px"
                    bg="var(--color-accent)"
                    color="#fff"
                />
            </div>
        </FormStyled>
    );
}

const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #f9f9f9;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 500px;  /* Limit the maximum width */
    width: 100%;  /* Allow it to shrink on smaller screens */
    margin: 0 auto;  /* Center the form */

    .error {
        color: red;
        font-size: 0.875rem;
        margin-bottom: 1rem;
    }

    .input-control {
        display: flex;
        flex-direction: column;

        input, textarea, select {
            width: 100%;
            font-family: inherit;
            font-size: 1rem;
            padding: 0.8rem;
            border-radius: 5px;
            border: 1px solid #ccc;
            background: #fff;
            color: #222;

            &:focus {
                border-color: var(--color-accent);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            }

            &::placeholder {
                color: #999;
            }
        }
    }

    .submit-btn {
        display: flex;
        justify-content: center;

        button {
            width: 100%;
            max-width: 250px;
            background: var(--color-accent);
            color: #fff;
            padding: 0.8rem 1.6rem;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-size: 1rem;

            &:hover {
                background: var(--color-green);
            }
        }
    }

    @media (max-width: 768px) {
        

        .input-control {
            input, textarea, select {
                font-size: 0.9rem;
                padding: 0.6rem;
            }
        }

        .submit-btn {
            button {
                padding: 0.6rem 1.4rem;
                font-size: 0.9rem;
            }
        }
    }

    @media (max-width: 480px) {
        padding: 1rem;

        .input-control {
            input, textarea, select {
                font-size: 0.85rem;
                padding: 0.5rem;
            }
        }

        .submit-btn {
            button {
                padding: 0.5rem 1.2rem;
                font-size: 0.85rem;
                max-width: 200px;
            }
        }
    }
`;

export default ExpenseForm;
