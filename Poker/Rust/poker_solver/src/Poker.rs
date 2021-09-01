use std::collections::HashMap;

/// Accepts an array containing nine 32-bit unsigned integers in a permutation of the 
/// integers 1-52 and returns a vector containing the winning hand.
pub fn deal(perm:[u32;9]) -> Vec<String> {
    let perm_vec = perm.to_vec();

    let mut pool: Vec<u32> = perm_vec[4..].to_owned();
    let mut pool2: Vec<u32> = perm_vec[4..].to_owned();

    let mut first_hand = vec![perm_vec[0], perm_vec[2]];
    first_hand.append(&mut pool);

    let mut second_hand = vec![perm_vec[1], perm_vec[3]];
    second_hand.append(&mut pool2);

    let first_eval = evaluate(first_hand);
    let second_eval = evaluate(second_hand);
    let mut max_first;
    let mut max_second;

    if first_eval.1 != second_eval.1 {
        if first_eval.1 > second_eval.1 {
            return convert_to_one(&first_eval.0);
        }
        return convert_to_one(&second_eval.0);
    } else {
        let mut temp1 = first_eval.0.clone();
        let mut temp2 = second_eval.0.clone();
        temp1 = sort_cards(temp1);
        temp2 = sort_cards(temp2);

        max_first = max_num(&first_eval.0);
        max_second = max_num(&second_eval.0);

        while !temp1.is_empty() && !temp2.is_empty() && max_first == max_second {
            temp1 = temp1[0..(temp1.len()-1)].to_vec();
            temp2 = temp2[0..(temp2.len()-1)].to_vec();
            if !temp1.is_empty() {
                max_first = max_num(&temp1);
            }
            if !temp2.is_empty() {
                max_second = max_num(&temp2);
            }
        }

        if max_first == 14 && first_eval.1 == 8 {
            max_first = 1;
        }

        if max_second == 14 && second_eval.1 == 8 {
            max_second = 1;
        }

        if max_first > max_second {
            return convert_to_one(&first_eval.0);
        }

        else if max_first < max_second {
            return convert_to_one(&second_eval.0);
        }

        else if temp1.is_empty() && temp2.is_empty() && max_first == max_second {
            return convert_to_one(&first_eval.0);
        }
    }

    vec!["none".to_string()] 
}

/// Finds the largest card from a hand and returns its rank
/// as a 32-bit unsigned integer.
fn max_num(input: &[String]) -> u32 {
    let sorted = sort_cards(input.to_vec());
    let temp = &sorted[sorted.len()-1];
    temp[0..(temp.len()-1)].parse::<u32>().unwrap()
}

/// Accepts a hand containing cards and sorts it
/// in increasing order by card rank.
fn sort_cards(mut cards: Vec<String>) -> Vec<String> {
    cards.sort_by(|a, b| ((a[0..(a.len()-1)]).parse::<u32>().unwrap())
         .cmp(&(b[0..(b.len()-1)]).parse::<u32>().unwrap()));
    cards.to_vec()
}

/// Accepts a hand, evaluates it according to Texas Holdem rules
/// and returns a tuple containing the hand along with its ranking power.
/// Ranking power is ordered by: Royal Flush, Straight Flush, ... in decreasing order.
fn evaluate(hand: Vec::<u32>) -> (Vec<String>, u32) {
    let converted_hand = convert_to_cards(&hand);
    let mut result_hand;

    result_hand = check_royal_flush(&converted_hand);
    if !result_hand.is_empty() && result_hand[0] != "none" {
        return (result_hand, 9);
    }

    result_hand = check_straight_flush(&converted_hand);
    if !result_hand.is_empty() && result_hand[0] != "none" {
        return (result_hand, 8);
    }
    
    result_hand = check_four(&converted_hand);
    if !result_hand.is_empty() && result_hand[0] != "none" {
        return (result_hand, 7);
    }

    result_hand = check_full_house(&converted_hand);
    if !result_hand.is_empty() && result_hand[0] != "none" {
        return (result_hand, 6);
    }

    result_hand = check_flush(&converted_hand);
    if !result_hand.is_empty() && result_hand[0] != "none" {
        return (result_hand, 5);
    }

    result_hand = check_straight(&converted_hand);
    if !result_hand.is_empty() && result_hand[0] != "none" {
        return (result_hand, 4);
    }

    result_hand = check_three(&converted_hand);
    if !result_hand.is_empty() && result_hand[0] != "none" {
        return (result_hand, 3);
    }

    result_hand = check_two_pair(&converted_hand);
    if !result_hand.is_empty() && result_hand[0] != "none" {
        return (result_hand, 2);
    }

    result_hand = check_pair(&converted_hand);
    if !result_hand.is_empty() && result_hand[0] != "none" {
        return (result_hand, 1);
    }

    (vec![converted_hand[6].to_string()], 0)
}

/// Accepts a hand containing 9 32-bit unsigned permutation from
/// the integers 1-52 and converts it to cards.
fn convert_to_cards(hand: &[u32]) -> Vec<String> {
    let cards:[&str;52] = [ 
        "14C", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "11C", "12C", "13C",
		"14D", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "11D", "12D", "13D",
		"14H", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "11H", "12H", "13H",
	    "14S", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "11S", "12S", "13S" 
    ];
    let mut deal = Vec::new();

    for j in 0..7 {
        deal.push(cards[(hand[j] - 1) as usize].to_string());
    }
    
    deal = sort_cards(deal);
    
    deal
}

/// Accepts a hand and converts cards with rank 14 to 1 for compatibility. 
fn convert_to_one(input: &[String]) -> Vec<String> {
    let mut res = Vec::new();

    for each in input {
        if each[0..(each.len()-1)].parse::<u32>().unwrap() == 14 {
            res.push(format!("{}{}", 1, each.chars().last().unwrap()));
        } else {
            res.push(each.to_string());
        }
    }

    res
}

/// Returns a Royal Flush poker hand if present otherwise a vector containing the string "none".
fn check_royal_flush(input: &[String]) -> Vec<String> {
    let converted_hand = input;
    let mut single_hands = Vec::new();

    for each in converted_hand.iter() {
        let last = each.chars().last().unwrap();
        if single_hands.iter().filter(|&n| *n == last).count() == 0 {
            single_hands.push(last);
        }
    }

    let mut temp: Vec<String> = Vec::new();
    let mut temp_var;

    for hand in single_hands {
        temp_var = format!("{}{}", 10, hand);
        if converted_hand.iter().filter(|&n| *n == temp_var).count() == 1 {
            temp.push(temp_var);
            temp_var = format!("{}{}", 11, hand);
            if converted_hand.iter().filter(|&n| *n == temp_var).count() == 1 {
                temp.push(temp_var);
                temp_var = format!("{}{}", 12, hand);
                if converted_hand.iter().filter(|&n| *n == temp_var).count() == 1 {
                    temp.push(temp_var);
                    temp_var = format!("{}{}", 13, hand);
                    if converted_hand.iter().filter(|&n| *n == temp_var).count() == 1 {
                        temp.push(temp_var);
                        temp_var = format!("{}{}", 14, hand);
                        if converted_hand.iter().filter(|&n| *n == temp_var).count() == 1 {
                            temp.push(temp_var);
                            return temp;
                        }
                    }
                }
            }
        }
    }

    vec!["none".to_string()]
}

/// Returns a Straight Flush poker hand if present otherwise a vector containing the string "none".
fn check_straight_flush(input: &[String]) -> Vec<String> {
    let converted_hand = input;
    let mut single_hands = Vec::new();
    let mut single_ranks = Vec::new();
    let mut first_num;
    let mut second_num;
    let mut temp;
    let mut last;
  
    for each in converted_hand.iter() {
        first_num = each[0..(each.len()-1)].parse::<u32>().unwrap();
        last = (each.chars().last().unwrap()).to_string();
        if single_hands.iter().filter(|&n| *n == last).count() == 0 {
            single_hands.push(last);
        }
        if single_ranks.iter().filter(|&n| *n == first_num).count() == 0 {
            single_ranks.push(first_num);
        }
    }
  
    for each in single_hands.iter() {
        for num in single_ranks.iter().rev() {
            temp = Vec::new();
            last = format!("{}{}", num, (each.chars().last().unwrap())); 
            if converted_hand.iter().filter(|&n| *n == last).count() == 1 {
                temp.push(last);
                last = format!("{}{}", num-1, each.chars().last().unwrap());
                if converted_hand.iter().filter(|&n| *n == last).count() == 1 {
                    temp.push(last);
                    last = format!("{}{}", num-2, each.chars().last().unwrap());
                    if converted_hand.iter().filter(|&n| *n == last).count() == 1 {
                        temp.push(last);
                        last = format!("{}{}", num-3, each.chars().last().unwrap());
                        if converted_hand.iter().filter(|&n| *n == last).count() == 1 {
                            temp.push(last);
                            last = format!("{}{}", num-4, each.chars().last().unwrap());
                            if converted_hand.iter().filter(|&n| *n == last).count() == 1 {
                                temp.push(last);
                                return temp;
                            }
                        }
                    }
                }
            }
        }
    }

    let ranks = vec![2,3,4,5,14];
    let mut suits = Vec::new();
    let mut duplicate;
    temp = Vec::new();

    for cards in converted_hand.iter() {
        first_num = cards[0..(cards.len()-1)].parse::<u32>().unwrap();
        if ranks.iter().filter(|&n| *n == first_num).count() == 1 {
            duplicate = false;
            for each in temp.iter() {
                second_num = each[0..(each.len()-1)].parse::<u32>().unwrap();
                if second_num == first_num {
                    duplicate = true;
                }
            }
            if !duplicate {
                temp.push(cards.to_string());
            }
        }
    }

    for each in temp.iter() {
        last = (each.chars().last().unwrap()).to_string();
        if suits.iter().filter(|&n| *n == last).count() == 0 {
            suits.push(last);
        }
    }

    if suits.len() != 1 {
        return vec!["none".to_string()];
    }

    if temp.len() == 5 {
        return temp;
    }

    vec!["none".to_string()]
}

/// Returns a Four Of A Kind poker hand if present otherwise a vector containing the string "none".
fn check_four(input: &[String]) -> Vec<String> {
    let converted_hand = input;
    let mut single_ranks = Vec::new();
    let mut hand_rank = Vec::new();
    let mut temp = Vec::new();
    let mut first_num;
  
    for each in converted_hand.iter() {
        first_num = each[0..(each.len()-1)].parse::<u32>().unwrap();
        hand_rank.push(first_num);
        if single_ranks.iter().filter(|&n| *n == first_num).count() == 0 {
            single_ranks.push(first_num);
        }
    }
  
    for num in single_ranks.iter() {
        if hand_rank.iter().filter(|&n| *n == *num).count() == 4 {
            for each in converted_hand.iter() {
                first_num = each[0..(each.len()-1)].parse::<u32>().unwrap();
                if first_num == *num {
                    temp.push(each.to_string());
                }
            }
            return temp;
        }
    }

    vec!["none".to_string()]
}

/// Returns a Full House poker hand if present otherwise a vector containing the string "none".
fn check_full_house(input: &[String]) -> Vec<String> {
    let converted_hand = input;
    let mut hand_rank = Vec::new();
    let mut iter_ranks = HashMap::new();
    let mut max_two = "0";
    let mut max_three = "0";
    let mut temp = Vec::new();
    let mut i = 0;
    
    for each in converted_hand.iter() {
        hand_rank.push(each[0..(each.len()-1)].parse::<u32>().unwrap().to_string());
    }

    for each in hand_rank.iter() {
        if iter_ranks.contains_key(each) {
            iter_ranks.insert(each, iter_ranks.get(each).unwrap() + 1);
        } else {
            iter_ranks.insert(each, 1);
        }
    }

    let temp_iter = iter_ranks.clone();
    for (key,value) in temp_iter.iter() {
        if *value < 2 {
            iter_ranks.remove(key);
        }
    }

    for (key,value) in iter_ranks.iter() {
        if (*value == 2) && (max_two.parse::<u32>().unwrap() < key.parse::<u32>().unwrap()) {
            max_two = key;
        } else if (*value == 3) && (max_three.parse::<u32>().unwrap() < key.parse::<u32>().unwrap()) {
            max_three = key;
        }
    }

    if (iter_ranks.len() < 2) || (max_three == "0") {
        return vec!["none".to_string()];
    }

    if max_three != "0" && max_two == "0" {
        iter_ranks.remove(&max_three.to_string());
        max_two = iter_ranks.keys().last().unwrap()
    }

    for each in converted_hand.iter() {
        if (i < 3) && (each[0..(each.len()-1)].parse::<u32>().unwrap() == max_three.parse::<u32>().unwrap()) {
            temp.push(each.to_string());
            i += 1;
        }
    }
    
    i = 0;
    for each in converted_hand.iter() {
        if (i < 2) && (each[0..(each.len()-1)].parse::<u32>().unwrap() == max_two.parse::<u32>().unwrap()) {
            temp.push(each.to_string());
            i += 1;
        }
    }

    temp
}

/// Returns a Flush poker hand if present otherwise a vector containing the string "none".
fn check_flush(input: &[String]) -> Vec<String> {
    let converted_hand = input;
    let mut single_hands = Vec::new();
    let mut temp;
    let mut last;
    let mut count;
    
    for each in converted_hand.iter() {
      last = each.chars().last().unwrap();
      if single_hands.iter().filter(|&n| *n == last).count() == 0 {
        single_hands.push(last);
      }
    }

    for each in single_hands.iter() {
        count = 0;
        temp = Vec::new();
        for card in converted_hand.iter().rev() {
            if &card.chars().last().unwrap() == each {
                temp.push(card.to_string());
                count += 1;
                if count == 5 {
                    return temp;
                }
            }
        }
    }

    vec!["none".to_string()]
}

/// Returns a Straight poker hand if present otherwise a vector containing the string "none".
fn check_straight(input: &[String]) -> Vec<String> {
    let converted_hand = input;
    let mut temp = Vec::new();
    let mut count = 0;
    let mut previous = 0;
    let mut first_num;

    for each in converted_hand.iter().rev() {
        first_num = each[0..(each.len()-1)].parse::<u32>().unwrap();
        if previous == 0 {
            previous = first_num;
            count += 1;
            temp.push(each.to_string());
        } else if first_num == (previous - 1) {
            temp.push(each.to_string());
            count += 1;
            previous = first_num;
            if count == 5 {
                return temp;
            }
        } else if first_num != previous {
            temp = vec![each.to_string()];
            previous = first_num;
            count = 1;
        }
    }

    let ranks = vec![2,3,4,5,14];
    let mut duplicate;
    temp = Vec::new();

    for each in converted_hand.iter() {
        first_num = each[0..(each.len()-1)].parse::<u32>().unwrap();
        if ranks.iter().filter(|&n| *n == first_num).count() == 1 {
            duplicate = false;
            for cards in temp.iter() {
                if first_num == cards[0..(cards.len()-1)].parse::<u32>().unwrap() {
                    duplicate = true;
                }
            }
            if !duplicate {
                temp.push(each.to_string());
            }
        }
    }

    if temp.len() == 5 {
        return temp;
    }

    vec!["none".to_string()]
}

/// Returns a Three Of A Kind poker hand if present otherwise a vector containing the string "none".
fn check_three(input: &[String]) -> Vec<String> {
    let converted_hand = input;
    let mut hand_rank = Vec::new();
    let mut iter_ranks = HashMap::new();
    let mut max_three = 0;
    let mut temp = Vec::new();
    let mut i = 0;
  
    for each in converted_hand.iter() {
        hand_rank.push(each[0..(each.len()-1)].parse::<u32>().unwrap().to_string());
    }

    for each in hand_rank.iter() {
        if iter_ranks.contains_key(each) {
            iter_ranks.insert(each, iter_ranks.get(each).unwrap() + 1);
        } else {
            iter_ranks.insert(each, 1);
        }
    }
  
    let temp_iter = iter_ranks.clone();
    for (key,value) in temp_iter.iter() {
        if *value < 3 {
            iter_ranks.remove(key);
        }
    }
  
    for (key,value) in iter_ranks.iter() {
        if (*value == 3) && (max_three < key.parse::<u32>().unwrap()) {
            max_three = key.parse::<u32>().unwrap();
        }
    }

    if max_three == 0 {
        return vec!["none".to_string()];
    }

    for each in converted_hand.iter() {
        if (i < 3) && (each[0..(each.len()-1)].parse::<u32>().unwrap() == max_three) {
            temp.push(each.to_string());
            i += 1;
        }
    }
  
    temp
}

/// Returns a Two Pair poker hand if present otherwise a vector containing the string "none".
fn check_two_pair(input: &[String]) -> Vec<String> {
    let converted_hand = input;
    let mut hand_rank = Vec::new();
    let mut iter_ranks = HashMap::new();
    let mut temp = Vec::new();
  
    for each in converted_hand.iter() {
        hand_rank.push(each[0..(each.len()-1)].parse::<u32>().unwrap());
    }

    for each in hand_rank.iter() {
        if iter_ranks.contains_key(each) {
            iter_ranks.insert(each, iter_ranks.get(each).unwrap() + 1);
        } else {
            iter_ranks.insert(each, 1);
        }
    }

    let temp_iter = iter_ranks.clone();
    for (key,value) in temp_iter.iter() {
        if *value < 2 {
            iter_ranks.remove(key);
        }
    }
  
    for each in converted_hand.iter() {
        if iter_ranks.contains_key(&each[0..(each.len()-1)].parse::<u32>().unwrap()) {
            temp.push(each.to_string());
        }
    }

    if temp.len() < 4 {
        return vec!["none".to_string()];
    }

    temp[temp.len()-4..].to_vec()
}

/// Returns a One Pair poker hand if present otherwise a vector containing the string "none".
fn check_pair(input: &[String]) -> Vec<String> {
    let converted_hand = input;
    let mut hand_rank = Vec::new();
    let mut iter_ranks = HashMap::new();
    let mut max_two = "0";
    let mut temp = Vec::new();
    let mut i = 0;
  
    for each in converted_hand.iter() {
        hand_rank.push(each[0..(each.len()-1)].parse::<u32>().unwrap().to_string());
    }
  
    for each in hand_rank.iter() {
        if iter_ranks.contains_key(each) {
            iter_ranks.insert(each, iter_ranks.get(each).unwrap() + 1);
        } else {
            iter_ranks.insert(each, 1);
        }
    }
  
    let temp_iter = iter_ranks.clone();
    for (key,value) in temp_iter.iter() {
        if *value < 2 {
            iter_ranks.remove(key);
        }
    }
  
    for (key,value) in iter_ranks.iter() {
        if (*value == 2) && (max_two.parse::<u32>().unwrap() < key.parse::<u32>().unwrap()) {
            max_two = key;
        }
    }

    if max_two == "0" {
        return vec!["none".to_string()];
    }
  
    for each in converted_hand.iter() {
        if (i < 2) && (each[0..(each.len()-1)].parse::<u32>().unwrap() == max_two.parse::<u32>().unwrap()) {
            temp.push(each.to_string());
            i += 1;
        }
    }

    temp
}

#[cfg(test)]
/// Unittests for Poker.rs library
mod tests {
    use super::*;

    #[test]
    fn test_hands() {
        let mut hands: HashMap<[u32;9], Vec<&str>> = HashMap::new();
        // 1  Hands:  2-6 Straight Flush VS 1-5 Straight Flush
        //    Winner: 2-6 Straight Flush
        hands.insert([ 9,  8,  7,  6,  5,  4,  3,  2,  1  ], vec![ "2C",  "3C",  "4C",  "5C",  "6C"  ]);
        // 2  Hands:  Royal Flush VS Straight Flush
        //    Winner: Royal Flush
        hands.insert([ 40, 41, 42, 43, 48, 49, 50, 51, 52 ], vec![ "10S", "11S", "12S", "13S", "1S"  ]);
        // 3  Hands:  Four Aces VS 2-Full-of-A
        //    Winner: Four Aces
        hands.insert([ 40, 41, 27, 28, 1,  14, 15, 42, 29 ], vec![ "1C",  "1D",  "1H",  "1S"         ]);
        // 4  Hands:  3-Fours VS 2-Fours
        //    Winner: 3-Fours
        hands.insert([ 30, 13, 27, 44, 12, 17, 33, 41, 43 ], vec![ "4D",  "4H",  "4S"                ]);
        // 5  Hands:  Flush VS Straight
        //    Winner: Flush
        hands.insert([ 27, 45, 3,  48, 44, 43, 41, 33, 12 ], vec![ "2S",  "4S",  "5S",  "6S",  "9S"  ]);
        // 6  Hands:  3-Fours VS 2-Queens-2-Fives
        //    Winner: 3-Fours
        hands.insert([ 17, 31, 30, 51, 44, 43, 41, 33, 12 ], vec![ "4D",  "4H",  "4S"                ]);
        // 7  Hands:  Q-Full-of-K VS Q-Full-of-4
        //    Winner: Q-Full-of-K
        hands.insert([ 17, 39, 30, 52, 44, 25, 41, 51, 12 ], vec![ "12C", "12D", "12S", "13H", "13S" ]);
        // 8  Hands:  9-K Straight VS 9-J-Two-Pair
        //    Winner: 9-K Straight
        hands.insert([ 11, 25, 9,  39, 50, 48, 3,  49, 45 ], vec![ "10S", "11S", "12D", "13H", "9S"  ]);
        // 9  Hands:  J-K-Two-Pair VS K-Pair
        //    Winner: J-K-Two-Pair
        hands.insert([ 50, 26, 39, 3,  11, 27, 20, 48, 52 ], vec![ "11C", "11S", "13H", "13S",       ]);
        // 10 Hands: A-Pair VS J-Pair
        //    Winner: Ace-Pair
        hands.insert([ 40, 52, 46, 11, 48, 27, 29, 32, 37 ], vec![ "1H",  "1S"                       ]);
        
        let mut correct = true;
        for (hand, solution) in &hands {
            let temp_hand = deal(*hand);
            let res = temp_hand.iter().map(std::ops::Deref::deref).collect::<Vec<&str>>();
            for card in solution {
                if !res.contains(card) {
                    correct = false;
                    println!("Test Failed with:\nInput = {:?}\nOutput = {:?}\nCorrect Solution = {:?}\n", *hand, res, solution);
                    break;
                }
            }
            assert!(correct);
        }

    }
}
